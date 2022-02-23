package kr.giljabi.xml;

import kr.giljabi.api.geo.Geometry3DPoint;

import java.util.ArrayList;
import java.util.List;

public class TcxWriter {
    private static final String NEWLINE = System.getProperty("line.separator");
    private List<Geometry3DPoint> trackPoints = new ArrayList<>();
    private String courseName;

    private StringBuffer createTcxHeader() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>").append(NEWLINE);
        buffer.append("<TrainingCenterDatabase xmlns=\"http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2\" ").append(NEWLINE);
        buffer.append("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ").append(NEWLINE);
        buffer.append("xsi:schemaLocation=\"http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 " +
                "http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd\">").append(NEWLINE);
        return buffer;
    }

    public TcxWriter(String courseName, List<Geometry3DPoint> trackPoints) {
        this.courseName = courseName;
        this.trackPoints = trackPoints;
    }

    private StringBuffer createTcxFolder() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("<Folders>").append(NEWLINE);
        buffer.append("	<Courses>").append(NEWLINE);
        buffer.append("		<CourseFolder Name=\"giljabi.kr\">").append(NEWLINE);
        buffer.append("			<CourseNameRef>").append(NEWLINE);
        buffer.append("				<Id>"+ courseName +"</Id>").append(NEWLINE);
        buffer.append("				<Author>giljabi</Author>").append(NEWLINE);
        buffer.append("			</CourseNameRef>").append(NEWLINE);
        buffer.append("		</CourseFolder>").append(NEWLINE);
        buffer.append("	</Courses>").append(NEWLINE);
        buffer.append("</Folders>").append(NEWLINE);
        return buffer;
    }

    /**
     * 획득고도 계산중.....
     * @param form
     * @return
     */
    /*
    private StringBuffer createTrackpoint() {
        StringBuffer trackBuffer = new StringBuffer();
        StringBuffer courseBuffer = new StringBuffer();

        boolean flag = true;	//다음값을 사용할것인지 결정
        double currentLat = 0, currentLon = 0, nextLat = 0, nextLon = 0;
        double currElev = 0.0, nextElev = 0.0;

        double  totalDistance = 0.0;	// 누적거리
        int totalSeconds = 0;			// 누적시간

        double elevUp = 0.0, elevDown = 0.0, baseEle = 0.0;
        int index = 0;
        for(Geometry3DPoint trkseq : trackPoints) {
            if(flag == true) {
                currentLat = trkseq.getLat();
                currentLon = trkseq.getLng();
                if("".compareTo(trkseq.getEle()) == 0)
                    nextElev = 0;
                else
                    currElev = Double.parseDouble(trkseq.getEle());

                nextLat = currentLat;
                nextLon = currentLon;
                nextElev = currElev;

            } else {
                nextLat = Double.parseDouble(trkseq.getLat());
                nextLon = Double.parseDouble(trkseq.getLng());
                if("".compareTo(trkseq.getEle()) == 0)
                    nextElev = 0;
                else
                    nextElev = Double.parseDouble(trkseq.getEle());
                double unitDistance = getDistanceFromLatLon(currentLat, currentLon, nextLat, nextLon);
                double deltaHeight = Math.abs(nextElev - currElev);
                double slope = deltaHeight / unitDistance * 100;

                //System.out.println("slope:" + slope);
                if(slope >= 1/24) { // 1/24*100 4.16% 기울기는 평지로 볼 수 있으나 자전거는??
                    if((nextElev - currElev) >= 0)
                        elevUp += (nextElev - currElev);
                    else
                        elevDown += (nextElev - currElev);
                }
            }
            //System.out.println(index++ + " elevUp:" + elevUp + " elevDn:" + elevDown+ " elev:" + trkseq.getEle());

            //직전 위치에서 현재까지 거리
            double trackDistance = getDistanceFromLatLon(currentLat, currentLon, nextLat, nextLon);
            totalDistance += trackDistance;
            String resultDateTime = getElapsedTime(form.getVelocity(), totalDistance);

            //직전 위치에서 현재까지 소요시간 초
            double second = trackDistance * 3.6 / Double.parseDouble(form.getVelocity());
            totalSeconds += second;

            trackBuffer.append(trkseq.getTcxXml(resultDateTime, totalDistance));
            if(flag == false) {
                currentLat = nextLat;
                currentLon = nextLon;
                currElev = nextElev;
            }
            flag = false;
        }

        //Up/Down Elevation
        System.out.println("up ▲ :" + elevUp +", down ▼ :" + elevDown);
        form.setUpElevation("▲" + String.format("%,d", (int)elevUp));
        form.setDownElevation("▼" + String.format("%,d",Math.abs((int)elevDown)));

        courseBuffer = createCourse(form.getCourseName(), totalSeconds, (int)totalDistance
                , form.getTrackPoint()[0], form.getTrackPoint()[form.getTrackPoint().length - 1]
                , form.getVelocity());
        form.setDistance((int)totalDistance);
        form.setSecondtime(totalSeconds);

        //Course 정보가 먼저 나와야 한다. 순서는 실제 520에서 테스트는 아직 안함
        courseBuffer.append("		<Track>").append(NEWLINE);
        courseBuffer.append(trackBuffer);
        courseBuffer.append("		</Track>").append(NEWLINE);
        return courseBuffer;
    }
*/


}
