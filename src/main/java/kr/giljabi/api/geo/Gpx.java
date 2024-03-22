package kr.giljabi.api.geo;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@Getter
@Setter
@XmlRootElement(name = "gpx")
public class Gpx {
    @XmlElement(name = "trk")
    public List<GpxTrack> tracks;

    public void addTrack(GpxTrack track) {
        this.tracks.add(track);
    }

    @Getter
    @Setter
    public class GpxTrack {
        @XmlElement(name = "name")
        private String name;

        @XmlElement(name = "trkseg")
        private List<GpxTrackSegment> segment;

        // getters and setters
    }

    @Getter
    @Setter
    public class GpxTrackSegment {
        @XmlElement(name = "trkpt")
        private List<GpxTrackPoint> trackPoint;

        public void addTrackPoint(GpxTrackPoint trackPoint) {
            this.trackPoint.add(trackPoint);
        }
        // getters and setters
    }


    @Getter
    @Setter
    public class GpxTrackPoint {
        @XmlAttribute(name = "lat")
        private double latitude;

        @XmlAttribute(name = "lon")
        private double longitude;

        @XmlElement(name = "ele")
        private Double elevation;

        @XmlElement(name = "time")
        private String time;

        // getters and setters
    }
}