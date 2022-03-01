package kr.giljabi.api.utils;

/**
 * @author eahn.park@gmail.com
 * 2022-02-20 javascript에서 처리하게 개선
 *
 */
public class WaypointSort implements Comparable<WaypointSort> {
	private int index;
	private double distance;
	private String lat;
	private String lng;
	private String sym;
	private String ele;
	private String name;
	private String time;	//계산된 후 입력 
	
	public WaypointSort(int index, double distance
			, String lat, String lng, String sym, String ele, String name) {
		this.index = index;
		this.distance = distance;
		this.lat = lat;
		this.lng = lng;
		this.sym = sym;
		this.ele = ele;
		this.name = name;
	}
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public double getDistance() {
		return distance;
	}
	public void setDistance(double distance) {
		this.distance = distance;
	}
	
	@Override
	public String toString() {
		return "TrackSort [index=" + index + ", distance=" + distance + ", lat=" + lat + ", lng=" + lng + ", sym=" + sym
				+ ", ele=" + ele + ", name=" + name + "]";
	}
	@Override
	public int compareTo(WaypointSort o) {
        if (this.index < o.getIndex()) {
            return -1;
        } else if (this.index > o.getIndex()) {
            return 1;
        }
        return 0;
	}	
	
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public String getLng() {
		return lng;
	}
	public void setLng(String lng) {
		this.lng = lng;
	}
	public String getSym() {
		return sym;
	}
	public void setSym(String sym) {
		this.sym = sym;
	}
	public String getEle() {
		return ele;
	}
	public void setEle(String ele) {
		this.ele = ele;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}

}
