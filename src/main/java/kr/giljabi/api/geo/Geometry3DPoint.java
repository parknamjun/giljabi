package kr.giljabi.api.geo;

import lombok.Getter;
import lombok.Setter;

import java.text.DecimalFormat;

/**
 * 위경도 좌표에 높이 정보가 있는 데이터 
 * eahn.park@gmail.com
 * 2018-12-22
 */
@Getter
@Setter
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
