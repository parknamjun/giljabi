package kr.giljabi.api.request;

import lombok.*;

import javax.validation.constraints.NotNull;

/**
 * openrouteservice에 요청 시작, 목적지 위치
 */
@Data
@NotNull
@Setter
@Getter
public class RouteData {
    private Double[] start;
    private Double[] target;
    private String profile;
    private String clientIp;

    public RouteData(Double[] start, Double[] target, String profile, String clientIp) {
        this.start = start;
        this.target = target;
        this.profile = profile;
        this.clientIp = clientIp;
    }
}
