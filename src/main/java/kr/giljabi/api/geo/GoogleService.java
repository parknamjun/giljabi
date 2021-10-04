package kr.giljabi.api.geo;

import com.google.gson.Gson;
import kr.giljabi.api.request.RequestElevationData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.text.DecimalFormat;
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

    public ArrayList<Geometry3DPoint> getElevation(RequestElevationData request) throws Exception {
        StringBuffer location = new StringBuffer();
        List<RequestElevationData.Geometry2DPoint> trackPoint = request.getTrackPoint();
        int MAXCOUNT = 4;

        Gson gson = new Gson();

        ArrayList<Geometry3DPoint> returnLocationList = new ArrayList<Geometry3DPoint>();

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
                GoogleElevation googleElevation = gson.fromJson(jsonElevation, GoogleElevation.class);

                if(googleElevation.getStatus().compareTo("OK") == 0) {
                    log.info("Elevation info success...");
                    for(GoogleElevation.Results result : googleElevation.getResults()) {
                        Geometry3DPoint point = new Geometry3DPoint();
                        point.setLng(result.getLocation().getLng());
                        point.setLat(result.getLocation().getLat());

                        DecimalFormat decimalFormat = new DecimalFormat("#.#"); //소수점 1자리만...
                        point.setEle(Double.parseDouble(decimalFormat.format(result.getElevation())));

                        returnLocationList.add(point);
                    }
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        long end = System.currentTimeMillis();
        return returnLocationList;
    }

    //key를 parameter로 처리하는 이유는 최초 접속 테스트는 key가 필요없기 때문에...
    private String httpGet(String paramter) throws Exception {
        String key = String.format("key=%s&", apikey);
        String location = String.format("%s=%s", "locations", paramter);

        String requestUrl = elevationUrl + key + location;
        log.info(requestUrl);

        URL myUrl = new URL(requestUrl);
        HttpsURLConnection conn = (HttpsURLConnection)myUrl.openConnection();
        conn.setRequestMethod("GET");

        return readerHttpStream(conn);

    }

    public String readerHttpStream(HttpsURLConnection conn) throws UnsupportedEncodingException, IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

        String inputLine = "";
        String jsonString = "";
        while((inputLine = in.readLine()) != null) { // response 출력
            jsonString += inputLine.replace(" ", "");
        }
        in.close();
        return jsonString;
    }


}
