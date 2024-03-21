package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.service.GoogleService;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.response.Response;
import kr.giljabi.api.utils.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Gpx track 정보를 tcx 변환
 *
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
    @ApiOperation(value = "고도정보", notes = "google elevation api 이용하여 고도정보를 받아오는 api")
    public Response getElevation(final @Valid @RequestBody RequestElevationData request) {
        ArrayList<Geometry3DPoint> list;
        Response response;
        try {
            if (request.getTrackPoint().size() == 0)
                new Exception("입력된 트랙정보가 없습니다.");

            //tcp socket exception 방지, 개발초기에 간혹 발생했었는데 이제는 이런 문제는 없는듯...
            //googleService.checkGoogle();

            list = googleService.getElevation(request);
            return new Response(list);
            //return getMountainData();
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }

    @GetMapping("/api/1.0/mountain")
    @ApiOperation(value = "고도정보", notes = "google elevation api 이용하여 고도정보를 받아오는 api")
    public Response getMountain() {
        ArrayList<Geometry3DPoint> list = null;
        Response response;

        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:/kr/*.gpx");
            for (Resource resource : resources) {
                log.info(resource.getFilename());
            }

            return new Response(list);
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }

    private Response getMountainData() {
        Response response = new Response(0, "정상 처리 되었습니다.");
        ArrayList<Geometry3DPoint> data = new ArrayList<>();
        data.add(new Geometry3DPoint(127.013472, 37.953889, 153.4));
        data.add(new Geometry3DPoint(127.045492, 37.921015, 107.4));
        data.add(new Geometry3DPoint(127.114628, 37.912896, 325.3));
        data.add(new Geometry3DPoint(127.162436, 37.974824, 205.6));
        data.add(new Geometry3DPoint(127.139509, 37.984367, 265.8));
        response.setData(data);
        return response;
    }
}
