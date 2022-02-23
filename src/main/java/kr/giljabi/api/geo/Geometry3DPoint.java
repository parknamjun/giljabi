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

	public String getTcxTrackinfo(String appentTime, double distance) {
		StringBuffer buffer = new StringBuffer(256);
		buffer.append("			<Trackpoint>\n");
		buffer.append("				<Time>" + appentTime + "</Time>\n");
		buffer.append("				<Position>\n");
		buffer.append("					<LatitudeDegrees>" + this.lat + "</LatitudeDegrees>\n");
		buffer.append("					<LongitudeDegrees>" + this.lng + "</LongitudeDegrees>\n");
		buffer.append("				</Position>\n");
		buffer.append("				<AltitudeMeters>" + this.ele + "</AltitudeMeters>\n");
		buffer.append("				<DistanceMeters>" + String.format("%.2f", distance) + "</DistanceMeters>\n");	//누적거리
		buffer.append("			</Trackpoint>\n");
		return buffer.toString();
	}

}
