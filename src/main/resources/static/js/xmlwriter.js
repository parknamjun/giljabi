
let xmlData = '';
let NEWLINE = '\n';

function gpxHeader() {
	xmlData += '<?xml version="1.0" encoding="UTF-8"?>' + NEWLINE;
	xmlData += '<gpx xmlns="http://www.topografix.com/GPX/1/1" ' + NEWLINE;
	xmlData += ' creator="giljabi" version="1.1"' +  + NEWLINE;
	xmlData += ' xmlns:xsd="http://www.w3.org/2001/XMLSchema" ';
	xmlData += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' + NEWLINE;
}

function gpxMetadata(courseName, velocity) {
	xmlData += '<metadata>' + NEWLINE;
	xmlData += '  <name>' + courseName + '</name>' + NEWLINE;
	xmlData += '  <link href="http://www.giljabi.kr" />' + NEWLINE;
	xmlData += '  <desc>giljabi</desc>' + NEWLINE;
	xmlData += '  <copyright>giljabi.kr</copyright>' + NEWLINE;
	xmlData += '  <speed>' + velocity + '</speed>' + NEWLINE;
	xmlData += '</metadata>' + NEWLINE;
}

/**
 * 전체 경로에서 각 웨이포인트와 가장 가까운 위치로 변경한다.
 * @param waypoint
 */
function gpxWaypoint(waypoint, trackArray) {
	let waypointList = [];
	for(let i = 0; i < waypoint.length; i++) {
		let compareDistance = 0;
		let trackIndex = 0;
		let wpt = waypoint[i].position;
		console.info("org  waypointList:" + waypoint.toString());

		for(let j = 0; j < trackArray.length; j++) {
			let track = trackArray[j];
			let trackDistance = getDistanceFromLatLon(track.lat, track.lng, wpt.getLat(), wpt.getLng());
			if(j === 0)
				compareDistance = trackDistance;

			//웨이포인트에서 가장 가까운 경로
			if(trackDistance <= compareDistance) {
				compareDistance = trackDistance;
				trackIndex = j;
				console.info('근접거리:' + compareDistance + ', index:' + j);
			}
		}
		let point = trackArray[trackIndex];
		waypointList.push(point);
		/*
		waypointList.add(new WaypointSort(trackIndex, compareDistance
			, point.getLat(), point.getLng(), wpt.getSym(), point.getEle()
			, wpt.getName()));
		 */
	}
	console.info("next waypointList:" + waypointList.toString());

	for(let i = 0; i < waypoint.length; i++) {
		let wpt = waypoint[i].customoverlay;
		xmlData += '	<wpt lat="' + wpt.lat + '" lon="' + wpt.lng + '">' + NEWLINE;
		xmlData += '		<name>' + wpt.name + '</name>' + NEWLINE;
		xmlData += '		<sym>' + wpt.sym +'</sym>' + NEWLINE;
		// += '		<time>' + wpt.time + '</time>' + NEWLINE;
		xmlData += '	</wpt>' + NEWLINE;
	}
}

function gpxTrack(trackArray) {
	xmlData += '	<trk>' + NEWLINE;
	xmlData += '		<trkseg>' + NEWLINE;
	for(let i = 0; i < trackArray.length; i++) {
		let track = trackArray[i];
		xmlData += '		<trkpt lat="'+ track.lat + '" lon="' + track.lng + '">' + NEWLINE;
		xmlData += '			<ele>'+ track.ele + '</ele>' + NEWLINE;
		//xmlData += '			<time>2009-10-17T18:37:34Z</time>' + NEWLINE;
		xmlData += '		</trkpt>' + NEWLINE;
	}
	xmlData += '		</trkseg>' + NEWLINE;
	xmlData += '	</trk>' + NEWLINE;
	xmlData += '</gpx>' + NEWLINE;
}