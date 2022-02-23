package kr.giljabi.api.request;

import jdk.nashorn.internal.objects.annotations.Constructor;
import lombok.*;

import javax.validation.Valid;
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

    public RouteData(Double[] start, Double[] target, String profile) {
        this.start = start;
        this.target = target;
        this.profile = profile;
    }
}
