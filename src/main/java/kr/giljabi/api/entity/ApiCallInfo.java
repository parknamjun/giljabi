package kr.giljabi.api.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter @Setter
@ToString
@NoArgsConstructor
public class ApiCallInfo extends BaseEntity {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private double atLat;
    private double atLng;
    private double toLat;
    private double toLng;

    @JoinColumn(name = "API_CODE")
    @Enumerated(EnumType.STRING)
    private ApiCode apiCode;

    private int distance;

    @JoinColumn(name = "PROFILE_CODE")
    @Enumerated(EnumType.STRING)
    private ProfileCode profileCode;

    private int trackCount;
    private int requestCount;
    private int duration;
    private int ascent;
    private int descent;
}
