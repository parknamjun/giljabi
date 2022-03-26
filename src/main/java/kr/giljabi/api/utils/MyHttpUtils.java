package kr.giljabi.api.utils;

import kr.giljabi.api.exception.GiljabiException;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

/**
 * Http Utils
 * @date 2022.03.26
 */
@Slf4j
public class MyHttpUtils {
    public static String httpGetMethod(String url) throws IOException {
        HttpGet httpGet = new HttpGet(url); //POST call
        httpGet.setHeader("Accept", "application/json; charset=utf-8");
        httpGet.setHeader("Content-Type", "application/json; charset=utf-8");

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response = httpClient.execute(httpGet);

        String result = "";
        try {
            if (response.getStatusLine().getStatusCode() != 200)
                throw new GiljabiException(response.getStatusLine().getStatusCode(),
                        " 응답 오류입니다.");

            ResponseHandler<String> handler = new BasicResponseHandler();
            result = handler.handleResponse(response);
            //System.out.println("result = " + result);;
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            if(response != null) response.close();
            if(httpClient != null) httpClient.close();
        }
        return result;
    }

    /**
     *
     * @param url
     * @param urlParameters
     * @return
     * @throws IOException
     */
    public static String httpPostMethod(String url, List<NameValuePair> urlParameters) throws IOException {
        HttpPost httpPost = new HttpPost(url); //POST call
        httpPost.setHeader("Accept", "application/json; charset=utf-8");
        httpPost.setHeader("Content-Type", "application/json; charset=utf-8");

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response = httpClient.execute(httpPost);

        String result = "";
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters));
            if (response.getStatusLine().getStatusCode() != 200)
                throw new GiljabiException(response.getStatusLine().getStatusCode(),
                        " 응답 오류입니다.");

            ResponseHandler<String> handler = new BasicResponseHandler();
            result = handler.handleResponse(response);
            //System.out.println("result = " + result);;
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            if(response != null) response.close();
            if(httpClient != null) httpClient.close();
        }
        return result;
    }

    /**
     * Open route service post call method
     * @param url
     * @param json
     * @param apikey
     * @return
     * @throws IOException
     * @throws GiljabiException
     */
    public static String httpPostMethod(String url,
                                        JSONObject json,
                                        String apikey) throws IOException, GiljabiException {
        HttpPost httpPost = new HttpPost(url);
        httpPost.setHeader("Authorization", apikey);
        httpPost.setHeader("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
        httpPost.setHeader("Content-Type", "application/json; charset=utf-8");

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
            if (response != null) response.close();
            if (httpClient != null) httpClient.close();
        }
        log.info(result);
        return result;
    }
}
