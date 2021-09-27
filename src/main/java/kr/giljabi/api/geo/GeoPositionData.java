package kr.giljabi.api.geo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

/**
 * @author parknamjun(eahn.park@gmail.com)
 * @date   2018-12-22
 */
@Getter
@RequiredArgsConstructor
@ToString
public class GeoPositionData {
	public double lng;
	public double lat;
	public double ele;

	public GeoPositionData(double lng, double lat, double ele) {
		this.lng = lng / 1E5;
		this.lat = lat / 1E5;
		this.ele = ele / 100;
	}

}