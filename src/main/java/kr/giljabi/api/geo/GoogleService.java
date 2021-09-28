package kr.giljabi.api.geo;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.request.RequestRouteData;
import kr.giljabi.api.utils.GeometryDecoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
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

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleService {
    @Value("${giljabi.google.elevation.apikey}")
    private String apikey;

    @Value("${giljabi.google.elevation.elevationUrl}")
    private String elevationUrl;

    public void checkGoogle() throws Exception {
        String paramter = "locations=37.566102885810565,126.97594723621106";
        makeHttpGet(false, paramter);
    }

    //key를 parameter로 처리하는 이유는 최초 접속 테스트는 key가 필요없기 때문에...
    private String makeHttpGet(boolean checkFlag, String paramter) throws IOException {
        String keyParameter = String.format("%s=%s&", "key", apikey);
        String requestUrl = String.format("%s%s%s", elevationUrl, keyParameter, paramter);
        log.info(requestUrl);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        String result = "";
        try {
            HttpGet httpGet = new HttpGet(requestUrl);
            httpGet.setHeader("Content-Type", "application/json; charset=utf-8");

            CloseableHttpResponse response = httpClient.execute(httpGet);

            try {
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    result = EntityUtils.toString(entity);
                    log.info(result);
                }
            } finally {
                response.close();
            }
        } finally {
            httpClient.close();
        }
        return result;
    }


}
