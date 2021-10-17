package kr.giljabi.api.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.Value;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * openrouteservice에 요청 시작, 목적지 위치
 */
@Data
@RequiredArgsConstructor
@ToString
@NotNull
public class RequestRouteData {
    private Double start_lat;
    private Double start_lng;
    private Double target_lat;
    private Double target_lng;
    private String profile;
}
