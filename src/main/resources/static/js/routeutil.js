/**
 * Degree to radian
 * @param deg
 * @returns {number}
 */
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

/**
     * 위경도 좌표를 이용하여 거리를 Meter 단위로 변환
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @returns
     */
    function getDistanceFromLatLon(lat1, lng1, lat2, lng2) {
        let R = 6371; 					// Radius of the earth in km
        let dLat = deg2rad(lat2-lat1);
        let dLon = deg2rad(lng2-lng1);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c * 1000; 			// Distance in meter
        return Number(d.toFixed(3));
    }

    function getDistance(fromPoint, toPoint) {
        let R = 6371; 					// Radius of the earth in km
        let dLat = deg2rad(toPoint.lat - fromPoint.lat);
        let dLon = deg2rad(toPoint.lng - fromPoint.lng);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(fromPoint.lat)) * Math.cos(deg2rad(toPoint.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c * 1000; 			// Distance in meter
        return Number(d.toFixed(3));
    }

    /**
     * 가변으로 생성되는 input box의 id값
     * @param get_as_float
     * @returns
     */
    function microtime(get_as_float){ 
    // Returns either a string or a float containing the current time in seconds and microseconds
    // version: 812.316 
    // discuss at: http://phpjs.org/functions/microtime 
    // +   original by: Paulo Ricardo F. Santos 
    // *     example 1: timeStamp = microtime(true); 
    // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000 
        let now = new Date().getTime() / 1000;
        let s = parseInt(now);
        return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    }

    /**
     * 기준시간에서 평속으로 가는 시간, 가상라이더
     */
    function appendTime(time) {
        let defaultTime = new Date('2018-01-01T00:00:00Z');
        defaultTime.setSeconds(defaultTime.getSeconds() + time);
        return defaultTime.toISOString().split('.', 1) + 'Z';
    }

    let _microTime = Math.round(microtime(true)*100);
    let _fileExt;	//_ft 파일종류 gpx, tcx

	//시작, 도착 마커
	function makeMarkerPoint(mymap, iconName, latlon) {
        let marker = new kakao.maps.Marker({
	        position: new kakao.maps.LatLng(latlon.lat, latlon.lon),
	        image : new kakao.maps.MarkerImage(
	    		    'images/'+iconName+'.png',
	    		    new kakao.maps.Size(17, 22))
	    });
		marker.setMap(mymap);
	}

    function xmlToString(xmlData) {
        var xmlString;
        //IE
        if (window.ActiveXObject){
            xmlString = xmlData.xml;
        }
        // code for Mozilla, Firefox, Opera, etc.
        else{
            xmlString = (new XMLSerializer()).serializeToString(xmlData);
        }
        return xmlString;
    }

    /**
     * return waypoint
     * @param lat
     * @param lon
     * @param ele
     * @param name
     * @param desc
     * @param type
     * @param sym
     * @returns {{}}
     * getGpxWpt
     */
    function GpxWaypoint(lat, lon, ele, name, desc, type, sym) {
        this.uid = _microTime++;
        this.position = new kakao.maps.LatLng(lat, lon);
        this.ele = ele;
        this.name = name;		//웨이포인트 이름
        this.desc = desc;		//웨이포인트 설명
        this.type = type;		//sym 설명
        this.sym = sym;
    }

    GpxWaypoint.prototype.toString = function toString() {
        return JSON.stringify($(this)[0], null, 2);
    }

    /**
     *
     * @param lat
     * @param lon
     * @param ele
     * @returns {*
     * getGpxTrk
     */
    function Point3D(lat, lng, ele) {
        this.lat = lat;
        this.lng = lng;
        this.ele = ele;
    }
    Point3D.prototype.toString = function toString() {
        return JSON.stringify($(this)[0], null, 2);
    }

    function getIconString(sym) {
        if(_waypointIcons.indexOf(sym) >= 0)
            return sym;
        else
            return 'generic';
    }

    function WayPointInfo(index, distance, time, point, symbol, symbolName) {
        this.index = index;
        this.distance = distance;
        this.time = time;
        this.point = point;
        this.symbol = symbol;
        this.symbolName = symbolName;
    }
    WayPointInfo.prototype.toString = function toString() {
        return JSON.stringify($(this)[0], null, 2);
    }