package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.geo.GoogleService;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

/**
 * Gpx track 정보를 tcx 변환
 * @author eahn.park@gmail.com
 * date   2018-11-24
 * 2021.09.17 Spring boot 2.5.4
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class ElevationController {

    private final GoogleService googleService;

    @PostMapping("/api/1.0/elevation")
    @ApiOperation(value = "", notes = "google elevation api 이용하여 고도정보를 받아오는 api")
    public Response getElevation(@RequestBody RequestElevationData request) {
        ArrayList<Geometry3DPoint> list;
        try {
            if (request.getTrackPoint().size() == 0)
                new Exception("입력된 트랙정보가 없습니다.");

            //tcp socket exception 방지, 개발초기에 간혹 발생했었는데 이제는 이런 문제는 없는듯...
            //googleService.checkGoogle();

            list =  googleService.getElevation(request);
        } catch (Exception e) {
            return Response.of(e);
        }
        return Response.of().addObject(list);
    }



}
