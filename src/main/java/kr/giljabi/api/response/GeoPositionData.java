package kr.giljabi.api.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * @author parknamjun(eahn.park@gmail.com)
 * @date   2018-12-22
 */
@Getter
@Setter
@RequiredArgsConstructor
public class GeoPositionData {
	public String lat;
	public String lng;
	public String ele;
	
	@Override
	public String toString() {
		return "GeoPositionData [lat=" + lat + ", lng=" + lng + ", ele=" + ele + "]";
	}
}