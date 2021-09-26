package kr.giljabi.api.utils;

import java.util.ArrayList;

import kr.giljabi.api.dto.GeoPositionData;

/**
 * from https://github.com/GIScience/openrouteservice-docs
 *
 */
public class GeometryDecoder {
    public static ArrayList<GeoPositionData> decodeGeometry(String encodedGeometry, boolean inclElevation) {
		ArrayList<GeoPositionData> list = new ArrayList<GeoPositionData>();
        int len = encodedGeometry.length();
        int index = 0;
        int lat = 0;
        int lng = 0;
        int ele = 0;

        while (index < len) {
            int result = 1;
            int shift = 0;
            int b;
            do {
                b = encodedGeometry.charAt(index++) - 63 - 1;
                result += b << shift;
                shift += 5;
            } while (b >= 0x1f);
            lat += (result & 1) != 0 ? ~(result >> 1) : (result >> 1);

            result = 1;
            shift = 0;
            do {
                b = encodedGeometry.charAt(index++) - 63 - 1;
                result += b << shift;
                shift += 5;
            } while (b >= 0x1f);
            lng += (result & 1) != 0 ? ~(result >> 1) : (result >> 1);

            if(inclElevation){
                result = 1;
                shift = 0;
                do {
                    b = encodedGeometry.charAt(index++) - 63 - 1;
                    result += b << shift;
                    shift += 5;
                } while (b >= 0x1f);
                ele += (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            }

            GeoPositionData eleData = new GeoPositionData(lng, lat, ele);

            list.add(eleData);
        }
        return list;
    }
}