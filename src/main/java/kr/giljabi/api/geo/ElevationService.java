package kr.giljabi.api.geo;

import kr.giljabi.api.request.RequestElevationData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ElevationService {
    @Value("${giljabi.google.elevation.apikey}")
    private String apikey;

    @Value("${giljabi.google.elevation.elevationUrl}")
    private String elevationUrl;

    private HttpClient httpClient = HttpClientBuilder.create().build(); // HttpClient 생성

    //장시간 호출이 없는 경우 socket error가 잘생하므로 미리 호출한다
    //이때 key를 사용해도 되지만 호출건수가 증가하므로 key를 사용하지 않게 한다.
    public void checkGoogle() throws Exception {
        String paramter = "37.566102885810565,126.97594723621106";
        requestElevationService(paramter);
    }

    public ArrayList<Geometry3DPoint> getElevation(RequestElevationData request) throws Exception {
        List<RequestElevationData.Geometry2DPoint> trackPoint = request.getTrackPoint();
        ArrayList<Geometry3DPoint> returnPoint = new ArrayList<Geometry3DPoint>();

        int MAXCOUNT = 4;

        //elevation api는 하루 2500요청
        //get을 사용해하므로 request url의 길이는 8192를 넘지 않아야 한다.
        int maxPage = 0;
        if(trackPoint.size() % MAXCOUNT == 0)
            maxPage = (int)(trackPoint.size() / MAXCOUNT);
        else
            maxPage = (int)(trackPoint.size() / MAXCOUNT) + 1;

        long startTime = System.currentTimeMillis();

        try {
            int index = 0;
            StringBuffer location = new StringBuffer();
            for (int j = 1; j <= maxPage; j++) {
                for (; index < MAXCOUNT * j; index++) {
                    if (index == trackPoint.size())
                        break;
                    location.append(String.format("%s,%s|"
                            , trackPoint.get(index).getLat()
                            , trackPoint.get(index).getLng()));
                }
                Thread.sleep(1 * 1000);

                //고도정보
                HttpResponse response = requestElevationService(location.substring(0, location.length() - 1));
                if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                    ResponseHandler<String> handler = new BasicResponseHandler();
                    String jsonElevation = handler.handleResponse(response);
                    log.info(jsonElevation);
                }
                //응답옹 데이터
                //makeElevation(jsonElevation);
            }
        } catch(Exception e) {
            e.printStackTrace();
            throw e;
        }
        long endTime = System.currentTimeMillis();
        log.info("Google Elevation response time:" + (endTime - startTime));
        return returnPoint;
    }

    //key를 parameter로 처리하는 이유는 최초 접속 테스트는 key가 필요없기 때문에...
    private HttpResponse requestElevationService(String parameter) throws Exception {
        String key = String.format("key=%s&", apikey);
        String location = String.format("%s=%s&", "locations", parameter);

        String requestUrl = elevationUrl + key + location;
        log.info(requestUrl);

        //GET 호출만 사용가능
        HttpGet httpGet = new HttpGet(requestUrl);
        httpGet.setHeader("Content-Type", "application/json; charset=utf-8");

        return httpClient.execute(httpGet);
/*
        //예외처리 추가 필요
        if (response.getStatusLine().getStatusCode() == 200) {
            ResponseHandler<String> handler = new BasicResponseHandler();
            result = handler.handleResponse(response);
            log.info(result);
        } else {
            log.info("response is error : " + response.getStatusLine().getStatusCode());
        }
        return result;
 */
    }

}
