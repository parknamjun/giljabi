package kr.giljabi.api.geo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;

/**
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
public class GoogleElevation {
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
    public static class Location {
        private double lng;
        private double lat;;
    }
}
