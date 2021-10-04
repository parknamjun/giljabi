package kr.giljabi.api.geo;

import jdk.nashorn.internal.objects.annotations.Constructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author parknamjun(eahn.park@gmail.com)
 * @date   2018-12-22
 */
@Getter
@Setter
@RequiredArgsConstructor
public class Geometry3DPoint {
	public double lng;
	public double lat;
	public double ele;

	public Geometry3DPoint(double lng, double lat, double ele) {
		this.lng = lng;
		this.lat = lat;
		this.ele = ele;
	}
}