package kr.giljabi.api.request;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * 경로데이터
 * {
 *   "trackPoint":[{"lat":37.59244,"lng":127.03178},{"lat":37.59245,"lng":127.03221}...]
 * }
 */
@Data
@RequiredArgsConstructor
public class RequestElevationData {
    private List<Geometry2DPoint> trackPoint = new ArrayList<>();

    @Getter
    public static class Geometry2DPoint {
        public double lng;
        public double lat;

        public Geometry2DPoint(double lng, double lat) {
            //소수점 이하 5자리로 제한
            DecimalFormat decimalFormat = new DecimalFormat("#.#####");

            this.lng = Double.parseDouble(decimalFormat.format(lng));
            this.lat = Double.parseDouble(decimalFormat.format(lat));
        }
    }
}
