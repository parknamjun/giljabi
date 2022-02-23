package kr.giljabi.api.request;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class RequestRouteDataTest {

    @Test
    public void test() {
        String txt = "1212.11,22222.11111";
        Double[] test = Stream.of(txt.split(","))
                .mapToDouble(Double::parseDouble)
                .boxed().toArray(Double[]::new);
        System.out.println("test = " + test[0]);
        System.out.println("test = " + test[1]);
    }
}