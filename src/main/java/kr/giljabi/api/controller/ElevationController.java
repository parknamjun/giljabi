package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.geo.GoogleService;
import kr.giljabi.api.geo.RouteService;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.response.ErrorResponse;
import kr.giljabi.api.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Gpx track 정보를 tcx 변환
 * @author eahn.park@gmail.com
 * @date   2018-11-24
 * 2021.09.17 Spring boot 2.5.4
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class ElevationController {

    private final GoogleService googleService;

    @PostMapping("/api/1.0/getElevation")
    @ApiOperation(value = "", notes = "google elevation api 이용하여 고도정보를 받아오는 api")
    public Response getElevation(@RequestBody RequestElevationData request) {

        try {
            if (request.getTrackPoint().size() == 0)
                new Exception("입력된 트랙정보가 없습니다.");

            googleService.checkGoogle();
        /*
        try {
            //    list = geometryService.getOpenRouteService(request);
            //} catch(GiljabiException e) {
            //    return ErrorResponse.of(200, ErrorCode.OPENROUTESERVICE_ERROR);

        */
        } catch (Exception e) {
            return Response.of(e);
        }
        return Response.of().addObject(request.getTrackPoint());
    }



}
