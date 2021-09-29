package kr.giljabi.api.geo;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.request.RequestRouteData;
import kr.giljabi.api.utils.GeometryDecoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleService {
    @Value("${giljabi.google.elevation.apikey}")
    private String apikey;

    @Value("${giljabi.google.elevation.elevationUrl}")
    private String elevationUrl;


    private HttpClient httpClient = HttpClientBuilder.create().build(); // HttpClient 생성

    //장시간 호출이 없는 경우 socket error가 잘생하므로 미리 호출한다
    //이때 key를 사용해도 되지만 호출건수가 증가하므로 key를 사용하지 않게 한다.
    public void checkGoogle() throws Exception {
        String paramter = "37.566102885810565,126.97594723621106";
        httpGet(paramter);
    }

    public void getElevation(RequestElevationData request) throws Exception {
        StringBuffer location = new StringBuffer();
        List<RequestElevationData.Geometry2DPoint> trackPoint = request.getTrackPoint();
        int MAXCOUNT = 4;

        //elevation api는 하루 2500요청
        //get을 사용해하므로 request url의 길이는 8192를 넘지 않아야 한다.
        int maxPage = 0;
        if(trackPoint.size() % MAXCOUNT == 0)
            maxPage = (int)(trackPoint.size() / MAXCOUNT);
        else
            maxPage = (int)(trackPoint.size() / MAXCOUNT) + 1;

        try {
            int index = 0;
            for (int j = 1; j <= maxPage; j++) {
                for (; index < MAXCOUNT * j; index++) {
                    if (index == trackPoint.size())
                        break;
                    location.append(String.format("%s,%s|"
                            , trackPoint.get(index).getLat()
                            , trackPoint.get(index).getLng()));
                }
                Thread.sleep(1 * 1500);

                //고도정보
                String jsonElevation = httpGet(location.substring(0, location.length() - 1));
                log.info(jsonElevation);
                //응답옹 데이터
                //makeElevation(jsonElevation);
                location.setLength(0);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        long end = System.currentTimeMillis();
    }
/*
    public void makeElevation(String jsonElevation) {
        Gson gson = new Gson();
        List<Ge> result = gson.fromJson(jsonElevation , LinkedTreeMap.class);
        if(((String)result.get("status")).compareTo("OK") == 0) {
            logger.info(requestServer + ": Elevation info success...");
            ArrayList<LinkedTreeMap> elevationData = (ArrayList<LinkedTreeMap>)result.get("results");
            for(LinkedTreeMap edata : elevationData) {
                GeoPositionData eleData = new GeoPositionData();
                eleData.setLat(Double.toString((double)((LinkedTreeMap)edata.get("location")).get("lat")));
                eleData.setLng(Double.toString((double)((LinkedTreeMap)edata.get("location")).get("lng")));
                eleData.setEle(String.format("%.1f", (double)edata.get("elevation")));

                returnLocationList.add(eleData);
                //System.out.println(eleData.toString());
            }
        }
    }
*/
    //key를 parameter로 처리하는 이유는 최초 접속 테스트는 key가 필요없기 때문에...
    private String httpGet(String paramter) throws Exception {
        String result = "";
        String key = String.format("key=%s&", apikey);
        String location = String.format("%s=%s&", "locations", paramter);

        String requestUrl = elevationUrl + key + location;
        log.info(requestUrl);

        HttpGet httpGet = new HttpGet(requestUrl);
        httpGet.setHeader("Content-Type", "application/json; charset=utf-8");

        HttpResponse response = httpClient.execute(httpGet);

        //Response 출력
        if (response.getStatusLine().getStatusCode() == 200) {
            ResponseHandler<String> handler = new BasicResponseHandler();
            String body = handler.handleResponse(response);
            System.out.println(body);
        } else {
            System.out.println("response is error : " + response.getStatusLine().getStatusCode());
        }
        return result;
    }

}
