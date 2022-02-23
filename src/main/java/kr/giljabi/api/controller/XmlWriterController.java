package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.geo.GoogleService;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.request.XmlWriterRequest;
import kr.giljabi.api.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;

/**
 * gpx, tcx xml create...
 * @author eahn.park@gmail.com
 * date   2018-11-24
 * 2021.09.17 Spring boot 2.5.4
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class XmlWriterController {

    @PostMapping("/api/1.0/gpxinfo")
    @ApiOperation(value = "", notes = "gpx xml 정보 만들기")
    public Response makeGpxinfo(@RequestBody XmlWriterRequest request) {
        ArrayList<Geometry3DPoint> list = null;
        try {
            log.info("request:{1}", request);
            //list =  googleService.getElevation(request);
        } catch (Exception e) {
            return Response.of(new GiljabiException(9001, e.getMessage()));
        }
        return Response.of().addObject(list);
    }



}
