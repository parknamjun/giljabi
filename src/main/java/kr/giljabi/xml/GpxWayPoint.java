package kr.giljabi.xml;

import kr.giljabi.api.geo.Geometry3DPoint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GpxWayPoint {
	private String name = "";
	private String sym = "";
	private Double lat;
	private Double lng;
	private Double ele;


	public String getTcxXml(String datetime, double distance) {
		StringBuffer buffer = new StringBuffer(256);
		buffer.append("			<CoursePoint>\n");
		buffer.append("				<Name>"+ this.name +"</Name>\n");
		buffer.append("				<Time>"+ datetime +"</Time>\n");
		buffer.append("				<Position>\n");
		buffer.append("					<LatitudeDegrees>"+ this.getLat() + "</LatitudeDegrees>\n");
		buffer.append("					<LongitudeDegrees>"+ this.getLng() +"</LongitudeDegrees>\n");
		buffer.append("				</Position>\n");
		buffer.append("				<PointType>"+this.sym+"</PointType>\n");
		buffer.append("			</CoursePoint>\n");
		
		return buffer.toString();
	}

	//웨이포인트의 좌표와 track의 좌표가 동일하면 true를 반환한다.
	public boolean equals(Geometry3DPoint track) {
		if (this.getLat() == track.getLat() || this.getLng() == track.getLng())
			return true;
		else
			return false;
	}

}
