
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
/*
    function getDistanceFromLatLon(lat1, lng1, lat2, lng2) {
        let R = 6371; 	// Radius of the earth in km
        let dLat = deg2rad(lat2-lat1);
        let dLon = deg2rad(lng2-lng1);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) *
            Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c * 1000; 			// Distance in meter
        return Number(d.toFixed(3));
    }
*/
    //return km
    function getDistance(fromPoint, toPoint) {
        let R = 6371;
        let dLat = deg2rad(toPoint.lat - fromPoint.lat);
        let dLon = deg2rad(toPoint.lng - fromPoint.lng);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(fromPoint.lat)) *
            Math.cos(deg2rad(toPoint.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
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
     * 입력값이 문자일수도 있어 Number로 변환
     * @param lat
     * @param lon
     * @param ele
     * @returns {*
     * getGpxTrk
     */
    function Point3D(lat, lng, ele) {
        this.lat = Number(lat);
        this.lng = Number(lng);
        this.ele = Number(ele);
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

    function WayPointInfo(index, distance, time, point, symbol, symbolName, laptime) {
        this.index = index;
        this.distance = distance;
        this.time = time;
        this.point = point;
        this.symbol = symbol;
        this.symbolName = symbolName;
        this.laptime = laptime;
    }
    WayPointInfo.prototype.toString = function toString() {
        return JSON.stringify($(this)[0], null, 2);
    }


    /**
     *
     * @param waypointSortByDistance
     * @returns {string}
     */
    function getWaypointToHtml(waypointSortByDistance) {
        //우측에 웨이포인트를 출력하고, 엑셀로 저장할때도 사용한다.
        let waypointinfo = '';
        waypointinfo += '<table border=\"0\" style=\"border-collapse: collapse;\">';
        for (let i = 0; i < waypointSortByDistance.length; i++) {
            let sym = waypointSortByDistance[i].symbol.toLowerCase();
            waypointinfo += '<tr onclick=\"javascript:goCenter(' +
                waypointSortByDistance[i].point.lat + ',' + waypointSortByDistance[i].point.lng +
                ', 5);\">';
            waypointinfo += '<td ';
            if (sym == 'food') {
                waypointinfo += 'bgcolor=\"#FF0000\">';
            } else if (sym == 'water') {
                waypointinfo += 'bgcolor=\"#00FF00\">';
            } else
                waypointinfo += '>';
            waypointinfo += '<img src=\"/images/' + sym + '.png\" width=\"15\" height=\"18\"></td>';
            waypointinfo += '<td width=\'110px\' class=\'timeClass\'>' + waypointSortByDistance[i].symbolName + '</td>';
            waypointinfo += '<td width=\'20px\' align=\'right\' class=\'timeClass\'>' + waypointSortByDistance[i].distance + '</td>';
            waypointinfo += '<td width=\'70px\' align=\'right\' class=\'timeClass\'>' + waypointSortByDistance[i].laptime + '</td>';
            waypointinfo += '</tr>';
        }
        waypointinfo += '</table>';
        return waypointinfo;
    }

    /**
     * excel 저장을 위한 데이터
     * @param waypointSortByDistance
     * @returns {[]}
     */
    function getWaypointToExcel(waypointSortByDistance) {
        let waypointinfo = [];
        waypointinfo.push(['번호', '기호','웨이포인트','거리(km)','통과시간'])
        for (let i = 0; i < waypointSortByDistance.length; i++) {
            waypointinfo.push([
                (i + 1),
                waypointSortByDistance[i].symbol,
                waypointSortByDistance[i].symbolName,
                waypointSortByDistance[i].distance,
                waypointSortByDistance[i].time]);
        }
        return waypointinfo;
    }

    /**
     * 웨이포인트의 정확한 위치를 경로상에서 찾는디ㅏ
     * @param wpt
     * @returns {this}
     */
    function makeWaypointInfo(wpt) {
        let nearPoint;
        let waypointSortList = [];

        //경로의 시작점을 웨이포인트의 시작위치로 추가
        nearPoint = new WayPointInfo(0, 0, '0',
            _gpxTrkseqArray[0], 'start', 'START', '');
        waypointSortList.push(nearPoint);

        for (let indexWpt = 0; indexWpt < wpt.length; indexWpt++) {
            let compareDistance = 0;
            let trackIndex = 0;
            let fromPoint = new Point3D(wpt[indexWpt].lat, wpt[indexWpt].lng, 0);
            //경로상에 있는 포인트들과 각각의 웨이포인트의 거리를 비교하여 가장 가까운 거리에
            //있는 포인트를 웨이포인트의 좌표로 설정하여 웨이포인트의 순서를 정렬한다.
            for (let index = 0; index < _gpxTrkseqArray.length; index++) {
                let toPoint = _gpxTrkseqArray[index];
                let trackDistance = getDistance(fromPoint, toPoint);
                if (index == 0)
                    compareDistance = trackDistance;

                //웨이포인트에서 가장 가까이 위치한 포인트
                if (trackDistance <= compareDistance) {
                    compareDistance = trackDistance;
                    trackIndex = index;
                    //console.info('distance:' + trackDistance);
                }
            }
            nearPoint = new WayPointInfo(trackIndex, 0, '0',
                _gpxTrkseqArray[trackIndex], wpt[indexWpt].sym, wpt[indexWpt].name);
            waypointSortList.push(nearPoint);
            console.info(nearPoint.toString());
        }
        console.info(waypointSortList.toString());
        //웨이포인트를 index 기준으로 정렬한다.
        let waypointSortByDistance = waypointSortList.sort(function (a, b) {
            return a.index - b.index;
        });

        //경로의 마지막 위치는 웨이포인트이 마지막 위치로 추가
        nearPoint = new WayPointInfo(_gpxTrkseqArray.length - 1, 0, '0',
            _gpxTrkseqArray[_gpxTrkseqArray.length - 1], 'end', 'END', '');
        waypointSortByDistance.push(nearPoint);
        return waypointSortByDistance;
    }

    function excelFileExport(filename, excelData) {
        let sheetName = 'waypoint';
        let wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(excelData);

        let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

        saveAs(new Blob([s2ab(wbout)],{
            type:"application/octet-stream"}), filename + '.xlsx');
    }

    function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf);  //create uint8array as viewer
        for (let i = 0; i < s.length; i++)
            view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

    //지도의 중심으로 이동, _map global 변수 사용
    function goCenter(lat, lng, level) {
        _map.setLevel(5);
        _map.setCenter(new kakao.maps.LatLng(lat, lng));
    }

    /**
     * tcx 파일을 만들때 사용
     * @param point
     * @param time
     * @param dist
     * @constructor
     */
    function TrackPoint(point, time, dist) {
        this.time = time;
        this.position = new Point3D(point.lat, point.lng, point.ele.toFixed(0));
        this.distance = dist.toFixed(0);      //meter
    }
    TrackPoint.prototype.toString = function toString() {
        return JSON.stringify($(this)[0], null, 2);
    }


