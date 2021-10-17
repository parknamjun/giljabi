package kr.giljabi.api.geo;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.giljabi.api.request.RequestElevationData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Google elevation 서비스 
 * eahn.park@gmail.com
 * 2021.10.01
 * elevation api 이후 direction api를 사용해서 openrouteservice를 바꿀 수 있을지 확인...
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleService {
    @Value("${giljabi.google.elevation.apikey}")
    private String googleApikey;

    @Value("${giljabi.google.elevation.elevationUrl}")
    private String elevationUrl;

    @Value("${giljabi.google.elevation.googleGetCount}")
    private int googleGetCount;

    //장시간 호출이 없는 경우 socket error가 발생하므로 미리 호출한다
    //key를 사용해도 되지만 google api 호출건수가 증가하므로 key를 사용하지 않게 한다.
    public void checkGoogle() throws Exception {
        String paramter = "37.566102885810565,126.97594723621106";
        String jsonElevation = requestElevationService(paramter, "");
        log.info(jsonElevation);
    }

    public ArrayList<Geometry3DPoint> getElevation(RequestElevationData request) throws Exception {
        List<RequestElevationData.Geometry2DPoint> trackPoint = request.getTrackPoint();
        ArrayList<Geometry3DPoint> returnPoint = new ArrayList<>();

        //elevation api는 하루 2500요청
        //get을 사용해하므로 request url의 길이는 8192를 넘지 않아야 한다.
        int maxPage;
        if(trackPoint.size() % googleGetCount == 0)
            maxPage = (trackPoint.size() / googleGetCount);
        else
            maxPage = (trackPoint.size() / googleGetCount) + 1;

        long startTime = System.currentTimeMillis();

        try {
            int index = 0;
            StringBuilder buffer = new StringBuilder();
            Gson gson = new GsonBuilder().create();

            log.info("maxPage:" + maxPage);

            for (int j = 1; j <= maxPage; j++) {
                for (; index < googleGetCount * j; index++) {
                    if (index == trackPoint.size())
                        break;
                    buffer.append(String.format("%s,%s|"
                            , trackPoint.get(index).getLat()
                            , trackPoint.get(index).getLng()));
                }

                String jsonElevation = requestElevationService(buffer.substring(0, buffer.length() - 1), googleApikey);
                GoogleElevationData googleElevation = gson.fromJson(jsonElevation, GoogleElevationData.class);
                List<GoogleElevationData.Results> results = googleElevation.getResults();

                DecimalFormat decimalFormat = new DecimalFormat("#.#");
                for(GoogleElevationData.Results googleLocation : results) {
                    Geometry3DPoint point = new Geometry3DPoint(
                            googleLocation.getLocation().getLng(),
                            googleLocation.getLocation().getLat(),
                            Double.parseDouble(decimalFormat.format(googleLocation.getElevation()))
                    );
                    returnPoint.add(point);
                }
                //너물 짧은 간격으로 호출하면 문제가 있을 수 있다...1초 지연
                TimeUnit.SECONDS.sleep(1);
            }
        } catch(Exception e) {
            e.printStackTrace();
            throw e;
        }
        long endTime = System.currentTimeMillis();
        log.info("Google Elevation response time:" + (endTime - startTime));
        return returnPoint;
    }

    private String requestElevationService(String parameter, String key) throws Exception {
        String requestUrl = String.format("%s?locations=%s&key=%s", elevationUrl, parameter, key);
        URL elevationUrl = new URL(requestUrl);
        HttpsURLConnection httpConnection = (HttpsURLConnection)elevationUrl.openConnection();
        httpConnection.setRequestMethod("GET");

        StringBuilder stringBuilder = new StringBuilder();
        log.info("http status:" + httpConnection.getResponseCode());
        if(httpConnection.getResponseCode() == HttpStatus.SC_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(httpConnection.getInputStream()));
            String inputLine;
            while((inputLine = in.readLine()) != null) {
                stringBuilder.append(inputLine);
            }
            in.close();
        }
        return stringBuilder.toString();
    }

}
