
	let xmlData;
	let NEWLINE = '\n';

	function gpxHeader() {
		xmlData = '';	//저장할떼마다 초기화
		xmlData += '<?xml version="1.0" encoding="UTF-8"?>' + NEWLINE;
		xmlData += '<gpx xmlns="http://www.topografix.com/GPX/1/1" ' + NEWLINE;
		xmlData += ' creator="giljabi" version="1.1"' + NEWLINE;
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
	 * 웨이포인트를 경로상의 포인트로 변경할 필요는 없는거 같다...
	 * @param waypoint
	 */
	/*
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
	*/
	/**
	 * 소수점 자리수는 6자리를 사용, xml 파일 크기를 줄이기 위함
	 * @param waypoint
	 */
	function gpxWaypoint(waypoint) {
		for(let i = 0; i < waypoint.length; i++) {
			let wpt = waypoint[i];
			xmlData += '	<wpt lat="' + wpt.point.lat.toFixed(6) +
				'" lon="' + wpt.point.lng.toFixed(6) + '">' + NEWLINE;
			xmlData += '		<name>' + wpt.symbolName + '</name>' + NEWLINE;
			xmlData += '		<sym>' + wpt.symbol +'</sym>' + NEWLINE;
			xmlData += '		<time>' + wpt.time + '</time>' + NEWLINE;
			xmlData += '	</wpt>' + NEWLINE;
		}
	}

	function gpxTrack(trackArray) {
		xmlData += '	<trk>' + NEWLINE;
		xmlData += '		<trkseg>' + NEWLINE;
		for(let i = 0; i < trackArray.length; i++) {
			let track = trackArray[i];
			xmlData += '		<trkpt lat="'+ track.lat.toFixed(6) +
				'" lon="' + track.lng.toFixed(6) + '">' + NEWLINE;
			xmlData += '			<ele>'+ Math.round(track.ele) + '</ele>' + NEWLINE;
			xmlData += '		</trkpt>' + NEWLINE;
		}
		xmlData += '		</trkseg>' + NEWLINE;
		xmlData += '	</trk>' + NEWLINE;
		xmlData += '</gpx>' + NEWLINE;
	}