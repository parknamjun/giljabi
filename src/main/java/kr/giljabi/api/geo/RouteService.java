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

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {
    @Value("${giljabi.openrouteservice.apikey}")
    private String apikey;

    @Value("${giljabi.openrouteservice.directionUrl}")
    private String directionUrl;

    /**
     * openrouteservice
     * @param request
     * @return
     * @throws Exception
     */
    public ArrayList<Geometry3DPoint> getOpenRouteService(RequestRouteData request)
            throws Exception {


        //경로 요청 파라메터 정보를 만들고...
        Double[] start = new Double[]{request.getStart_lng(), request.getStart_lat()};
        Double[] target = new Double[]{request.getTarget_lng(), request.getTarget_lat()};
        Double[][] coordinates = {start, target};	//2개 위치만 사용

        JSONObject json = new JSONObject();
        json.put("coordinates", coordinates);   //좌표 배열로 입력 가능....
        json.put("elevation", "true");
        log.info(json.toString());

        HttpPost httpPost = makeHttpPost(request);
        String body = requestOpenRouteService(httpPost, json);

        Gson gson = new GsonBuilder().create();
        OSRDirectionV2 direction = gson.fromJson(body, OSRDirectionV2.class);
        ArrayList<OSRDirectionV2.Routes> routes = direction.getRoutes();

        //GeoPositionData를 배열로 구성하면 응답데이터를 크기를 줄일 수 있겠다...
        ArrayList<Geometry3DPoint> list = GeometryDecoder.decodeGeometry(routes.get(0).getGeometry(), true);

        return list; //gson.toJson(list);
    }

    private String requestOpenRouteService(HttpPost httpPost, JSONObject json) throws IOException {
        StringEntity postEntity = new StringEntity(json.toString());
        httpPost.setEntity(postEntity);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        String result = "";
        try {
            CloseableHttpResponse response = httpClient.execute(httpPost);
            try {
                //에러, 예외처리를 어떻게 할까나....
                if (response.getStatusLine().getStatusCode() != 200)
                    throw new GiljabiException(response.getStatusLine().getStatusCode(),
                            ErrorCode.OPENROUTESERVICE_ERROR);

                ResponseHandler<String> handler = new BasicResponseHandler();
                result = handler.handleResponse(response);
            } finally {
                response.close();
            }
        } finally {
            httpClient.close();
        }
        log.info(result);
        return result;
    }

    /**
     * Make post object for request header.
     * @param request
     * @return
     */
    private HttpPost makeHttpPost(RequestRouteData request) {
        directionUrl = String.format(directionUrl, request.getProfile());
        HttpPost httpPost = new HttpPost(directionUrl);
        httpPost.setHeader("Authorization", apikey);
        httpPost.setHeader("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
        httpPost.setHeader("Content-Type", "application/json; charset=utf-8");
        return httpPost;
    }

    /////////////////////////////////////////////////////////////

}
