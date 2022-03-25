package kr.giljabi.api.geo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;

/**
 * openrouteservice에서 받은 데이터 파싱
 * eahn.park@gmail.com
 * 2020.11.15
 */
@Setter @Getter
@ToString
public class OSRDirectionV2Data {
	public ArrayList<Routes> routes = new ArrayList<Routes>();
	public ArrayList<Object> bbox = new ArrayList<Object>();
	public Metadata metadata;
	public OSRDirectionV2Data() {
	}

	@Setter @Getter
	@ToString
	public class Metadata {
		private String attribution;
		private String service;
		private double timestamp;
		private Query query;
		private Engine engine;
	
	}

	@Setter @Getter
	@ToString
	public class Engine {
		private String version;
		private String build_date;
		private String graph_date;
	}

	@Setter @Getter
	@ToString
	public class Query {
		 ArrayList < Object > coordinates = new ArrayList < Object > ();
		 private String profile;
		 private String format;
		 private boolean elevation;
	}

	@Setter @Getter
	@ToString
	public class Routes {
		private Summary summary;
		private ArrayList < Object > segments = new ArrayList < Object > ();
		private ArrayList < Object > bbox = new ArrayList < Object > ();
		private String geometry;
		private ArrayList < Object > way_points = new ArrayList < Object > ();
	}

	@Setter @Getter
	@ToString
	public class Summary {
		private double distance;
		private double duration;
		private double ascent;
		private double descent;
	}
}
