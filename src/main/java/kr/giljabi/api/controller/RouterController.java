package kr.giljabi.api.controller;

import kr.giljabi.api.response.Response;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

/**
 * Open Route Service를 이용한 경로탐색
 * @author eahn.park@gmail.com
 * 2019-11-03 Initialize
 * 2021.01.10 openrouteapi license 변경
 * 2021.09.17 Spring boot 2.5.4 & thymeleaf
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class RouterController {

    @GetMapping("/api/1.0/getOpenRouter")
    public Response getOpenRouteService() {

        return Response.of();//.setData(new HashMap());
    }

    /**
     * openrouteservice에 요청할 시작, 끝 위치
     */
    @Data
    @RequiredArgsConstructor
    private class RequestData {
        private Double[] start;
        private Double[] end;
        private String direction;
        private String trackPoint;

    }

    @Data
    private class ResponseData {

    }
}
