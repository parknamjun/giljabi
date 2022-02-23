package kr.giljabi.api.request;

import kr.giljabi.api.geo.Geometry3DPoint;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 *
 */
@Data
@Setter
@Getter
public class XmlWriterRequest {
    private String velocity;	//평균이동속도
    private String fileName;	//파일명
    private String fileExtension;		//저장할 파일 확장자
    private String courseName;	//코스명
    private Geometry3DPoint[] trackPoint; //private GpxTrackPoint[] trackPoint;
    //private GpxWayPoint[] wayPoint;


    public XmlWriterRequest(String velocity, String fileName, String fileExtension, String courseName, Geometry3DPoint[] trackPoint) {
        this.velocity = velocity;
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.courseName = courseName;
        this.trackPoint = trackPoint;
    }
}
