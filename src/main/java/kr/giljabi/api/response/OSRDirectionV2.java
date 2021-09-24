package kr.giljabi.api.response;

import java.util.ArrayList;

/**
 * openrouteservice에서 받은 데이터 파싱
 * @2020.11.15
 */
public class OSRDirectionV2 {
	public ArrayList<Routes> routes = new ArrayList<Routes>();
	public ArrayList<Object> bbox = new ArrayList<Object>();
	public Metadata MetadataObject;

	public OSRDirectionV2() {
		
	}
	
	public ArrayList<Routes> getRoutes() {
		return routes;
	}

	public void setRoutes(ArrayList<Routes> routes) {
		this.routes = routes;
	}

	// Getter Methods
	public Metadata getMetadata() {
		return MetadataObject;
	}

	// Setter Methods
	public void setMetadata(Metadata metadataObject) {
		this.MetadataObject = metadataObject;
	}

	public class Metadata {
		private String attribution;
		private String service;
		private float timestamp;
		Query QueryObject;
		Engine EngineObject;
	
		// Getter Methods
		public String getAttribution() {
			return attribution;
		}
	
		public String getService() {
			return service;
		}
	
		public float getTimestamp() {
			return timestamp;
		}
	
		public Query getQuery() {
			return QueryObject;
		}
	
		public Engine getEngine() {
			return EngineObject;
		}
	
		// Setter Methods
	
		public void setAttribution(String attribution) {
			this.attribution = attribution;
		}
	
		public void setService(String service) {
			this.service = service;
		}
	
		public void setTimestamp(float timestamp) {
			this.timestamp = timestamp;
		}
	
		public void setQuery(Query queryObject) {
			this.QueryObject = queryObject;
		}
	
		public void setEngine(Engine engineObject) {
			this.EngineObject = engineObject;
		}
	}
	
	public class Engine {
		private String version;
		private String build_date;
		private String graph_date;
	
		// Getter Methods
		public String getVersion() {
			return version;
		}
	
		public String getBuild_date() {
			return build_date;
		}
	
		public String getGraph_date() {
			return graph_date;
		}
	
		// Setter Methods
	
		public void setVersion(String version) {
			this.version = version;
		}
	
		public void setBuild_date(String build_date) {
			this.build_date = build_date;
		}
	
		public void setGraph_date(String graph_date) {
			this.graph_date = graph_date;
		}
	}
	
	public class Query {
		 ArrayList < Object > coordinates = new ArrayList < Object > ();
		 private String profile;
		 private String format;
		 private boolean elevation;
	
	
		 // Getter Methods 
	
		 public String getProfile() {
		  return profile;
		 }
	
		 public String getFormat() {
		  return format;
		 }
	
		 public boolean getElevation() {
		  return elevation;
		 }
	
		 // Setter Methods 
	
		 public void setProfile(String profile) {
		  this.profile = profile;
		 }
	
		 public void setFormat(String format) {
		  this.format = format;
		 }
	
		 public void setElevation(boolean elevation) {
		  this.elevation = elevation;
		 }
	}
	public class Routes {
		 private Summary SummaryObject;
		 private ArrayList < Object > segments = new ArrayList < Object > ();
		 private ArrayList < Object > bbox = new ArrayList < Object > ();
		 private String geometry;
		 private ArrayList < Object > way_points = new ArrayList < Object > ();


		 // Getter Methods 

		 public Summary getSummary() {
		  return SummaryObject;
		 }

		 public String getGeometry() {
		  return geometry;
		 }

		 // Setter Methods 

		 public void setSummary(Summary summaryObject) {
		  this.SummaryObject = summaryObject;
		 }

		 public void setGeometry(String geometry) {
		  this.geometry = geometry;
		 }
		}
		public class Summary {
		 private float distance;
		 private float duration;
		 private float ascent;
		 private float descent;


		 // Getter Methods 

		 public float getDistance() {
		  return distance;
		 }

		 public float getDuration() {
		  return duration;
		 }

		 public float getAscent() {
		  return ascent;
		 }

		 public float getDescent() {
		  return descent;
		 }

		 // Setter Methods 

		 public void setDistance(float distance) {
		  this.distance = distance;
		 }

		 public void setDuration(float duration) {
		  this.duration = duration;
		 }

		 public void setAscent(float ascent) {
		  this.ascent = ascent;
		 }

		 public void setDescent(float descent) {
		  this.descent = descent;
		 }
		}
}