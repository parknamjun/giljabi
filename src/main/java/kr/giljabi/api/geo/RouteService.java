package kr.giljabi.api.geo;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.giljabi.api.request.RequestRouteData;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.utils.GeometryDecoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;

/**
 * 경로 탐색 클래스 
 * eahn.park@gmail.com
 * 2021.10.01
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {
    @Value("${giljabi.openrouteservice.apikey}")
    private String apikey;

    @Value("${giljabi.openrouteservice.directionUrl}")
    private String directionUrl;

    /**
     * openrouteservice를 사용하지만, google direction를 사용하는 것도 고려할 필요 있음
     */
    public ArrayList<Geometry3DPoint> getOpenRouteService(RequestRouteData request)
            throws Exception {
        //경로 요청 파라메터 정보를 만들고...
        Double[][] coordinates = {request.getStart(), request.getTarget()};

        JSONObject json = new JSONObject();
        json.put("coordinates", coordinates);   //좌표 배열로 입력 가능....
        json.put("elevation", "true");
        log.info(json.toString());

        directionUrl = String.format(directionUrl, request.getProfile());
        HttpPost httpPost = new HttpPost(directionUrl); //POST call
        httpPost.setHeader("Authorization", apikey);
        httpPost.setHeader("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
        httpPost.setHeader("Content-Type", "application/json; charset=utf-8");

        String body = requestOpenRouteService(httpPost, json);

        Gson gson = new GsonBuilder().create();
        OSRDirectionV2Data direction = gson.fromJson(body, OSRDirectionV2Data.class);
        ArrayList<OSRDirectionV2Data.Routes> routes = direction.getRoutes();

        //GeoPositionData를 배열로 구성하면 응답데이터를 크기를 줄일 수 있을수도...
        return GeometryDecoder.decodeGeometry(routes.get(0).getGeometry(), true);
    }

    private String requestOpenRouteService(HttpPost httpPost, JSONObject json) throws IOException {
        StringEntity postEntity = new StringEntity(json.toString());
        httpPost.setEntity(postEntity);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        String result;
        CloseableHttpResponse response = httpClient.execute(httpPost);
        try {
            if (response.getStatusLine().getStatusCode() != 200)
                throw new GiljabiException(response.getStatusLine().getStatusCode(),
                        ErrorCode.OPENROUTESERVICE_ERROR);

            ResponseHandler<String> handler = new BasicResponseHandler();
            result = handler.handleResponse(response);
        } finally {
            if(response != null) response.close();
            if(httpClient != null) httpClient.close();
        }
        //log.info(result);
        return result;
    }

    /////////////////////////////////////////////////////////////

}
