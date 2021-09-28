package kr.giljabi.api.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

/**
 * openrouteservice에 요청 시작, 목적지 위치
 */
@Data
@RequiredArgsConstructor
@ToString
public class RequestRouteData {
    private Double start_lat;
    private Double start_lng;
    private Double target_lat;
    private Double target_lng;
    private String profile;
}
