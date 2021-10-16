package kr.giljabi.api.utils;

import java.util.ArrayList;

import kr.giljabi.api.geo.Geometry3DPoint;

/**
 * from https://github.com/GIScience/openrouteservice-docs
 * OpenRouteService에서 사용하는 경로정보 decoder
 */
public class GeometryDecoder {
    public static ArrayList<Geometry3DPoint> decodeGeometry(String encodedGeometry, boolean inclElevation) {
		ArrayList<Geometry3DPoint> list = new ArrayList<Geometry3DPoint>();
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

            Geometry3DPoint eleData = new Geometry3DPoint(
                    (double)(lng / 1E5), (double)(lat / 1E5), (double)(ele / 100));

            list.add(eleData);
        }
        return list;
    }
}