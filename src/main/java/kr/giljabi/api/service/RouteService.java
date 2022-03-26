package kr.giljabi.api.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.giljabi.api.entity.ApiCallInfo;
import kr.giljabi.api.entity.ApiCode;
import kr.giljabi.api.entity.ClientInfo;
import kr.giljabi.api.entity.ProfileCode;
import kr.giljabi.api.geo.Geometry3DPoint;
import kr.giljabi.api.geo.OSRDirectionV2Data;
import kr.giljabi.api.repository.ApiCallInfoRepository;
import kr.giljabi.api.repository.ClientInfoRepository;
import kr.giljabi.api.request.RouteData;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.utils.GeometryDecoder;
import kr.giljabi.api.utils.MyHttpUtils;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

/**
 * 경로 탐색 클래스 
 * eahn.park@gmail.com
 * 2021.10.01
 */
@Slf4j
@Service
@Transactional
public class RouteService {
    @Value("${giljabi.openrouteservice.apikey}")
    private String apikey;

    @Value("${giljabi.openrouteservice.directionUrl}")
    private String directionUrl;

    private final ApiCallInfoRepository apiCallInfoRepository;
    private final ClientInfoRepository clientInfoRepository;

    /**
     * 생상자 주입방식을 권장
     * @param apiCallInfoRepository
     * @param clientInfoRepository
     */
    @Autowired
    public RouteService (ApiCallInfoRepository apiCallInfoRepository,
                         ClientInfoRepository clientInfoRepository) {
        this.apiCallInfoRepository = apiCallInfoRepository;
        this.clientInfoRepository = clientInfoRepository;

    }
    /**
     * openrouteservice를 사용하지만, google direction를 사용하는 것도 고려할 필요 있음
     */
    public ArrayList<Geometry3DPoint> getOpenRouteService(RouteData request)
            throws Exception {
        //경로 요청 파라메터 정보를 만들고...
        Double[][] coordinates = {request.getStart(), request.getTarget()};

        JSONObject json = new JSONObject();
        json.put("coordinates", coordinates);   //좌표 배열로 입력 가능....
        json.put("elevation", "true");
        log.info(json.toString());

        directionUrl = String.format(directionUrl, request.getProfile());

        String body = MyHttpUtils.httpPostMethod(directionUrl, json, apikey);

        Gson gson = new GsonBuilder().create();
        OSRDirectionV2Data direction = gson.fromJson(body, OSRDirectionV2Data.class);
        ArrayList<OSRDirectionV2Data.Routes> routes = direction.getRoutes();
        ArrayList<Geometry3DPoint> resultList = GeometryDecoder.decodeGeometry(routes.get(0).getGeometry(), true);

        log.info(direction.toString());
        log.info(resultList.toString());


        saveApiCallInfo(request, direction, resultList);

        //GeoPositionData를 배열로 구성하면 응답데이터를 크기를 줄일 수 있을수도...
        return resultList;
    }

    /**
     * save api_call_info table
     * @param request
     * @param direction
     * @param resultList
     */
    private void saveApiCallInfo(RouteData request, OSRDirectionV2Data direction, ArrayList<Geometry3DPoint> resultList) {
        //DB에 필요한 정보블 저장한다.
        ApiCallInfo apiCallInfo = new ApiCallInfo();
        apiCallInfo.setAtLng(request.getStart()[0]);
        apiCallInfo.setAtLat(request.getStart()[1]);
        apiCallInfo.setToLng(request.getTarget()[0]);
        apiCallInfo.setToLat(request.getTarget()[1]);
        apiCallInfo.setApiCode(ApiCode.DIRECTION);

        apiCallInfo.setDistance((int)direction.getRoutes().get(0).getSummary().getDistance());
        apiCallInfo.setDuration((int)direction.getRoutes().get(0).getSummary().getDuration());
        apiCallInfo.setAscent((int)direction.getRoutes().get(0).getSummary().getAscent());
        apiCallInfo.setDescent((int)direction.getRoutes().get(0).getSummary().getDescent());

        ProfileCode code = null;
        if(request.getProfile().compareTo("cycling-road") == 0)
            code = ProfileCode.CYCLING_ROAD;
        else if(request.getProfile().compareTo("cycling-mountain")  == 0)
            code = ProfileCode.CYCLING_MOUNTAIN;
        else if(request.getProfile().toUpperCase().compareTo("foot-hiking")  == 0)
            code = ProfileCode.FOOT_HIKING;
        else
            code = ProfileCode.CYCLING_ROAD;

        apiCallInfo.setProfileCode(code);

        apiCallInfo.setTrackCount(resultList.size());
        apiCallInfo.setRequestCount(0); //google elevation에서 호출한 횟수를 사용
        apiCallInfo.setCreateBy(request.getClientIp());
        log.info(apiCallInfo.toString());
        apiCallInfoRepository.save(apiCallInfo);
        log.info("apiCallInfo.id={}", apiCallInfo.getId());

        saveClientInfo(apiCallInfo);

    }

    /**
     * 사용자는 IP로 구분하고, IP를 기준으로 insert/update 한다.
     * @param apiCallInfo
     */
    private void saveClientInfo(ApiCallInfo apiCallInfo) {
        ClientInfo findClientInfo = clientInfoRepository.findByClientIp(apiCallInfo.getCreateBy());
        log.info("findClientInfo={}", findClientInfo);

        ClientInfo clientInfo = new ClientInfo();
        clientInfo.setClientIp(apiCallInfo.getCreateBy());
        clientInfo.setApiCode(apiCallInfo.getApiCode());
        clientInfo.setProfileCode(apiCallInfo.getProfileCode());

        if(findClientInfo == null) {
            //insert
            clientInfo.setAccumulate_distance(apiCallInfo.getDistance());    //누적 거리
            clientInfo.setAccumulate_count(1);       //누적 사용건수
            clientInfoRepository.save(clientInfo);
        } else {
            //update
            clientInfo.setAccumulate_distance(findClientInfo.getAccumulate_distance() +
                    apiCallInfo.getDistance());
            clientInfo.setAccumulate_count(findClientInfo.getAccumulate_count() + 1);
            clientInfoRepository.save(clientInfo);
            log.info("exist");
        }
    }

    /**
     *
     * @param httpPost
     * @param json
     * @return
     * @throws GiljabiException
     * @throws IOException
     */
    private String requestOpenRouteService(HttpPost httpPost, JSONObject json) throws GiljabiException, IOException {
        StringEntity postEntity = new StringEntity(json.toString());
        httpPost.setEntity(postEntity);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        String result;
        CloseableHttpResponse response = httpClient.execute(httpPost);
        try {
            if (response.getStatusLine().getStatusCode() != 200)
                throw new GiljabiException(response.getStatusLine().getStatusCode(),
                        "Openrouteservice 응답 오류입니다.");

            ResponseHandler<String> handler = new BasicResponseHandler();
            result = handler.handleResponse(response);
        } finally {
            if(response != null) response.close();
            if(httpClient != null) httpClient.close();
        }
        log.info(result);
        return result;
    }

}
