package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.geo.RouteService;
import kr.giljabi.api.request.RequestRouteData;
import kr.giljabi.api.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final RouteService geometryService;

    @GetMapping("/api/1.0/route")
    @ApiOperation(value="", notes = "openrouterservice에서 경로정보를 받아오는 api")
    public Response getRoute(@RequestBody RequestRouteData request) {
        ArrayList<Geometry3DPoint> list = new ArrayList<>();
        try {
            list = geometryService.getOpenRouteService(request);
        } catch(Exception e) {
            return Response.of(new GiljabiException(ErrorCode.OPENROUTESERVICE_ERROR));
        }
        return Response.of().addObject(list);
    }

}
