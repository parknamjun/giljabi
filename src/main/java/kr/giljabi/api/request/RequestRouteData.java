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
    private Double[] start;
    private Double[] target;
    private String profile;
}
