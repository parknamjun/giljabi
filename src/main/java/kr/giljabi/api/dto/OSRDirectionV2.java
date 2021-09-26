package kr.giljabi.api.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

/**
 * openrouteservice에서 받은 데이터 파싱
 * @2020.11.15
 */
@Setter @Getter
public class OSRDirectionV2 {
	public ArrayList<Routes> routes = new ArrayList<Routes>();
	public ArrayList<Object> bbox = new ArrayList<Object>();
	public Metadata metadata;
	public OSRDirectionV2() {
	}

	@Setter @Getter
	public class Metadata {
		private String attribution;
		private String service;
		private float timestamp;
		private Query query;
		private Engine engine;
	
	}

	@Setter @Getter
	public class Engine {
		private String version;
		private String build_date;
		private String graph_date;
	}

	@Setter @Getter
	public class Query {
		 ArrayList < Object > coordinates = new ArrayList < Object > ();
		 private String profile;
		 private String format;
		 private boolean elevation;
	}

	@Setter @Getter
	public class Routes {
		private Summary SummaryObject;
		private ArrayList < Object > segments = new ArrayList < Object > ();
		private ArrayList < Object > bbox = new ArrayList < Object > ();
		private String geometry;
		private ArrayList < Object > way_points = new ArrayList < Object > ();
	}

	@Setter @Getter
	public class Summary {
		private float distance;
		private float duration;
		private float ascent;
		private float descent;
	}
}