package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.service.GoogleService;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.response.Response;
import kr.giljabi.api.utils.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;

/**
 * Gpx track 정보를 tcx 변환
 * @author eahn.park@gmail.com
 * 2018.10.26 gpx to tcx Project start....
 * 2021.09.17 Spring boot 2.5.4
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class ElevationController {

    private final GoogleService googleService;

    @PostMapping("/api/1.0/elevation")
    @ApiOperation(value = "", notes = "google elevation api 이용하여 고도정보를 받아오는 api")
    public Response getElevation(final @Valid @RequestBody RequestElevationData request) {
        ArrayList<Geometry3DPoint> list;
        Response response;
        try {
            if (request.getTrackPoint().size() == 0)
                new Exception("입력된 트랙정보가 없습니다.");

            //tcp socket exception 방지, 개발초기에 간혹 발생했었는데 이제는 이런 문제는 없는듯...
            //googleService.checkGoogle();

            list =  googleService.getElevation(request);
            return new Response(list);
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }
}
