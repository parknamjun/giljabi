package kr.giljabi.api.request;

import kr.giljabi.api.exception.GiljabiException;
import kr.giljabi.api.utils.MyHttpUtils;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class RequestRouteDataTest {
    /*
    GET http://localhost:8080/api/1.0/route?start=127.01117,37.5555&target=126.99448,37.54565&direction=cycling-road
*/
    @Test
    public void openRouteTest1() throws IOException {
        String url = "http://localhost:8080/api/1.0/route?start=127.01117,37.5555&target=126.99448,37.54565&direction=cycling-road";

        String result = MyHttpUtils.httpGetMethod(url);
        System.out.println("result = " + result);
    }
}