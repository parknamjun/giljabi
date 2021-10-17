package kr.giljabi.api.geo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Google elevation api 수신데이터 
 * eahn.park@gmail.com
 * 2021.10.05
 https://developers.google.com/maps/documentation/elevation/start#maps_http_elevation_locations-java
 google result data
{
        "results":
        [
        {
        "elevation": 1608.637939453125,
        "location": { "lat": 39.7391536, "lng": -104.9847034 },
        "resolution": 4.771975994110107,
        },
        ],
        "status": "OK",
        }
 */

@Setter
@Getter
@RequiredArgsConstructor
public class GoogleElevationData {
    private String status;
    private List<Results> results;

    @Setter
    @Getter
    @RequiredArgsConstructor
    public class Results {
        private double elevation;
        private Location location;
        private double resolution;
    }

    @Setter
    @Getter
    @RequiredArgsConstructor
    public class Location {
        private double lng;
        private double lat;;
    }
}
