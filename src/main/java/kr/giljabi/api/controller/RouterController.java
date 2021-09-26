package kr.giljabi.api.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.dto.GeoPositionData;
import kr.giljabi.api.dto.OSRDirectionV2;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.response.ErrorResponse;
import kr.giljabi.api.response.Response;
import kr.giljabi.api.utils.GeometryDecoder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;

/**
 * Open Route Service를 이용한 경로탐색
 * @author eahn.park@gmail.com
 * 2019-11-03 Initialize
 * 2021.01.10 openrouteapi license 변경
 * 2021.09.17 Spring boot 2.5.4
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class RouterController {
    @Value("${giljabi.openrouteservice.apikey}")
    private String apikey;

    @Value("${giljabi.openrouteservice.directionUrl}")
    private String directionUrl;

    @GetMapping("/api/1.0/getRoute")
    @ApiOperation(value="", notes = "openrouterservice에서 경로정보를 받아오는 api")
    public Response getRoute(@RequestBody CreateRequestData request) {
        ArrayList<GeoPositionData> list = new ArrayList<>();
        try {
            list = getOpenRouteService(request);
        //} catch(GiljabiException e) {
        //    return ErrorResponse.of(200, ErrorCode.OPENROUTESERVICE_ERROR);
        } catch(Exception e) {
            return Response.of(e);
        }
        return Response.of().addObject(list);
    }

    private ArrayList<GeoPositionData> getOpenRouteService(CreateRequestData request)
            throws GiljabiException, Exception {
        directionUrl = String.format(directionUrl, request.getProfile());

        Double[] start = new Double[]{request.getStart_lng(), request.getStart_lat()};
        Double[] target = new Double[]{request.getTarget_lng(), request.getTarget_lat()};
        Double[][] coordinates = {start, target};	//2개 위치만 사용

        HttpPost httpPost = new HttpPost(directionUrl);
        httpPost.setHeader("Authorization", apikey);
        httpPost.setHeader("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
        httpPost.setHeader("Content-Type", "application/json; charset=utf-8");

        JSONObject json = new JSONObject();
        json.put("coordinates", coordinates);   //좌표 배열로 입력 가능....
        json.put("elevation", "true");

        log.info(json.toString());

        StringEntity postEntity = new StringEntity(json.toString());
        httpPost.setEntity(postEntity);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response = httpClient.execute(httpPost);
        if(response.getStatusLine().getStatusCode() != 200)
            throw new GiljabiException(response.getStatusLine().getStatusCode(),
                    ErrorCode.OPENROUTESERVICE_ERROR);

        ResponseHandler<String> handler = new BasicResponseHandler();
        String body = handler.handleResponse(response);
        log.info(body);

        Gson gson = new GsonBuilder().create();
        OSRDirectionV2 direction = gson.fromJson(body, OSRDirectionV2.class);
        ArrayList<OSRDirectionV2.Routes> routes = direction.getRoutes();

        ArrayList<GeoPositionData> list = GeometryDecoder.decodeGeometry(routes.get(0).getGeometry(), true);

        return list; //gson.toJson(list);
    }

    /**
     * openrouteservice에 요청 시작, 목적지 위치
     */
    @Data
    @RequiredArgsConstructor
    @ToString
    private static class CreateRequestData {
        private Double start_lat;
        private Double start_lng;
        private Double target_lat;
        private Double target_lng;
        private String profile;
    }

}
