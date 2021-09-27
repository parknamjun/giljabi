package kr.giljabi.api.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.geo.GeoPositionData;
import kr.giljabi.api.geo.GeometryService;
import kr.giljabi.api.geo.OSRDirectionV2;
import kr.giljabi.api.request.RequestOpenRouteServiceData;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.response.Response;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

    private final GeometryService geometryService;

    @GetMapping("/api/1.0/getRoute")
    @ApiOperation(value="", notes = "openrouterservice에서 경로정보를 받아오는 api")
    public Response getRoute(@RequestBody RequestOpenRouteServiceData request) {
        ArrayList<GeoPositionData> list = new ArrayList<>();
        try {
            list = geometryService.getOpenRouteService(request);
        //} catch(GiljabiException e) {
        //    return ErrorResponse.of(200, ErrorCode.OPENROUTESERVICE_ERROR);
        } catch(Exception e) {
            return Response.of(e);
        }
        return Response.of().addObject(list);
    }


}
