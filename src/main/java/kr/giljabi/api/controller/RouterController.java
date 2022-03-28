package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.request.RouteData;
import kr.giljabi.api.response.Response;
import kr.giljabi.api.service.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.AbstractList;
import java.util.ArrayList;
import java.util.List;

/**
 * Open Route Service를 이용한 경로탐색
 * @author eahn.park@gmail.com
 * 2018.10.26 gpx to tcx Project start....
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
    public Response getRoute(
            @RequestParam(name = "start") Double[] start,
            @RequestParam(name = "target") Double[] target,
            @RequestParam(name = "direction") String direction,
            HttpServletRequest request) {
        ArrayList<Geometry3DPoint> list = new ArrayList<>();
        try {
            RouteData routeData = new RouteData(start, target, direction, request.getRemoteAddr());
/*
//openroute service는 일 호출건수 제약이 있어 임의의 데이터를 응답데이터로 만들어 사용한다.
list.add(new Geometry3DPoint(127.01117, 37.5555, 42));
list.add(new Geometry3DPoint(127.01105, 37.55554, 42));
list.add(new Geometry3DPoint(127.01085, 37.55519, 42));
list.add(new Geometry3DPoint(127.01076, 37.55517, 42));
list.add(new Geometry3DPoint(127.0106, 37.55516, 42));
list.add(new Geometry3DPoint(127.01047, 37.55518, 42));
list.add(new Geometry3DPoint(127.0103, 37.55523, 42));
list.add(new Geometry3DPoint(127.01021, 37.55535, 42));
list.add(new Geometry3DPoint(127.01006, 37.55556, 42));
list.add(new Geometry3DPoint(127.01, 37.55564, 42));
list.add(new Geometry3DPoint(127.00993, 37.55575, 43));
list.add(new Geometry3DPoint(127.00956, 37.55625, 44));
list.add(new Geometry3DPoint(127.00931, 37.55662, 45));
list.add(new Geometry3DPoint(127.00924, 37.55674, 46));
list.add(new Geometry3DPoint(127.00917, 37.55685, 46));
list.add(new Geometry3DPoint(127.00894, 37.55721, 47));
list.add(new Geometry3DPoint(127.00893, 37.55724, 47));
list.add(new Geometry3DPoint(127.00872, 37.55748, 48));
list.add(new Geometry3DPoint(127.0087, 37.5575, 48));
list.add(new Geometry3DPoint(127.0082, 37.55797, 49));
list.add(new Geometry3DPoint(127.00807, 37.55807, 49));
list.add(new Geometry3DPoint(127.0076, 37.55835, 51));
list.add(new Geometry3DPoint(127.00752, 37.5584, 51));
list.add(new Geometry3DPoint(127.00707, 37.55866, 51));
list.add(new Geometry3DPoint(127.00685, 37.55881, 51));
list.add(new Geometry3DPoint(127.00618, 37.55898, 52));
list.add(new Geometry3DPoint(127.00613, 37.55899, 52));
list.add(new Geometry3DPoint(127.00605, 37.559, 51));
list.add(new Geometry3DPoint(127.00578, 37.55904, 49));
list.add(new Geometry3DPoint(127.00579, 37.55888, 48));
list.add(new Geometry3DPoint(127.0058, 37.55883, 48));
list.add(new Geometry3DPoint(127.00568, 37.55859, 47));
list.add(new Geometry3DPoint(127.00537, 37.55799, 46));
list.add(new Geometry3DPoint(127.00453, 37.55643, 50));
list.add(new Geometry3DPoint(127.00437, 37.55611, 54));
list.add(new Geometry3DPoint(127.00425, 37.55588, 57));
list.add(new Geometry3DPoint(127.00382, 37.55524, 66));
list.add(new Geometry3DPoint(127.00354, 37.55497, 69));
list.add(new Geometry3DPoint(127.0031, 37.55454, 74));
list.add(new Geometry3DPoint(127.00278, 37.55419, 73));
list.add(new Geometry3DPoint(127.00263, 37.55389, 74));
list.add(new Geometry3DPoint(127.00251, 37.55352, 76));
list.add(new Geometry3DPoint(127.00239, 37.55316, 79));
list.add(new Geometry3DPoint(127.00237, 37.55307, 80));
list.add(new Geometry3DPoint(127.00234, 37.55298, 81));
list.add(new Geometry3DPoint(127.00231, 37.5529, 81));
list.add(new Geometry3DPoint(127.00225, 37.55272, 83));
list.add(new Geometry3DPoint(127.00213, 37.5525, 84));
list.add(new Geometry3DPoint(127.00193, 37.5523, 85));
list.add(new Geometry3DPoint(127.00164, 37.55206, 87));
list.add(new Geometry3DPoint(127.00105, 37.55159, 91));
list.add(new Geometry3DPoint(127.00069, 37.55131, 95));
list.add(new Geometry3DPoint(127.00059, 37.55123, 96));
list.add(new Geometry3DPoint(127.00052, 37.55131, 97));
list.add(new Geometry3DPoint(127.00033, 37.55154, 99));
list.add(new Geometry3DPoint(127.00028, 37.55157, 100));
list.add(new Geometry3DPoint(127.00024, 37.55161, 100));
list.add(new Geometry3DPoint(127.00011, 37.55164, 102));
list.add(new Geometry3DPoint(126.99994, 37.55163, 103));
list.add(new Geometry3DPoint(126.99985, 37.55159, 104));
list.add(new Geometry3DPoint(126.99972, 37.55152, 105));
list.add(new Geometry3DPoint(126.99911, 37.55105, 110));
list.add(new Geometry3DPoint(126.99891, 37.55088, 111));
list.add(new Geometry3DPoint(126.99881, 37.55079, 111));
list.add(new Geometry3DPoint(126.99882, 37.5507, 112));
list.add(new Geometry3DPoint(126.99885, 37.55047, 113));
list.add(new Geometry3DPoint(126.99873, 37.55006, 117));
list.add(new Geometry3DPoint(126.99855, 37.54993, 119));
list.add(new Geometry3DPoint(126.99851, 37.54986, 120));
list.add(new Geometry3DPoint(126.99854, 37.54973, 121));
list.add(new Geometry3DPoint(126.99875, 37.54936, 125));
list.add(new Geometry3DPoint(126.99884, 37.549, 130));
list.add(new Geometry3DPoint(126.9993, 37.54775, 144));
list.add(new Geometry3DPoint(126.99934, 37.54751, 146));
list.add(new Geometry3DPoint(126.99927, 37.54706, 150));
list.add(new Geometry3DPoint(126.99915, 37.54691, 151));
list.add(new Geometry3DPoint(126.99893, 37.5468, 152));
list.add(new Geometry3DPoint(126.99885, 37.54671, 153));
list.add(new Geometry3DPoint(126.99879, 37.5466, 153));
list.add(new Geometry3DPoint(126.9987, 37.54615, 154));
list.add(new Geometry3DPoint(126.99864, 37.54603, 154));
list.add(new Geometry3DPoint(126.99853, 37.54592, 154));
list.add(new Geometry3DPoint(126.99826, 37.54577, 154));
list.add(new Geometry3DPoint(126.99813, 37.54564, 153));
list.add(new Geometry3DPoint(126.99802, 37.5454, 153));
list.add(new Geometry3DPoint(126.99763, 37.54508, 154));
list.add(new Geometry3DPoint(126.99738, 37.54482, 155));
list.add(new Geometry3DPoint(126.99703, 37.54456, 159));
list.add(new Geometry3DPoint(126.99675, 37.54438, 161));
list.add(new Geometry3DPoint(126.99664, 37.54436, 162));
list.add(new Geometry3DPoint(126.99651, 37.54436, 163));
list.add(new Geometry3DPoint(126.99638, 37.54439, 164));
list.add(new Geometry3DPoint(126.99626, 37.54448, 165));
list.add(new Geometry3DPoint(126.99623, 37.54456, 166));
list.add(new Geometry3DPoint(126.99602, 37.54508, 169));
list.add(new Geometry3DPoint(126.99594, 37.54515, 169));
list.add(new Geometry3DPoint(126.99582, 37.54523, 169));
list.add(new Geometry3DPoint(126.99566, 37.54528, 169));
list.add(new Geometry3DPoint(126.99522, 37.54537, 171));
list.add(new Geometry3DPoint(126.99448, 37.54565, 175));
*/
            list = geometryService.getOpenRouteService(routeData);
        } catch(GiljabiException e) {
            return Response.of(e);
        } catch(Exception e) {
            return Response.of(new GiljabiException(9001, e.getMessage()));
        }

        return Response.of().addObject(list);
    }



}
