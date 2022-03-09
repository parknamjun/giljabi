
	let xmlData;
	let NEWLINE = '\n';

	function gpxHeader() {
		xmlData = '';	//저장할떼마다 초기화
		xmlData += '<?xml version="1.0" encoding="UTF-8"?>' + NEWLINE;
		if (_filetype === 'gpx') {
			xmlData += '<gpx xmlns="http://www.topografix.com/GPX/1/1" ' + NEWLINE;
			xmlData += ' creator="giljabi" version="1.1"' + NEWLINE;
			xmlData += ' xmlns:xsd="http://www.w3.org/2001/XMLSchema" ';
			xmlData += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' + NEWLINE;
		} else {
			xmlData += '<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"' + NEWLINE;
			xmlData += ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + NEWLINE;
			xmlData += ' xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">' + NEWLINE;
		}
	}

	function gpxMetadata(filename, velocity) {
		if (_filetype === 'gpx') {
			xmlData += '<metadata>' + NEWLINE;
			xmlData += '  <name>' + filename + '</name>' + NEWLINE;
			xmlData += '  <link href="http://www.giljabi.kr" />' + NEWLINE;
			xmlData += '  <desc>giljabi</desc>' + NEWLINE;
			xmlData += '  <copyright>giljabi.kr</copyright>' + NEWLINE;
			xmlData += '  <speed>' + velocity + '</speed>' + NEWLINE;
			xmlData += '</metadata>' + NEWLINE;
		} else {
			xmlData += '<Folders>' + NEWLINE;
			xmlData += '	<Courses>' + NEWLINE;
			xmlData += '		<CourseFolder Name="giljabi.kr">' + NEWLINE;
			xmlData += '			<CourseNameRef>' + NEWLINE;
			xmlData += '				<Id>' + filename + '</Id>' + NEWLINE;
			xmlData += '				<Author>Giljabi</Author>' + NEWLINE;
			xmlData += '			</CourseNameRef>' + NEWLINE;
			xmlData += '		</CourseFolder>' + NEWLINE;
			xmlData += '	</Courses>' + NEWLINE;
			xmlData += '</Folders>' + NEWLINE;
			xmlData += '<Courses>' + NEWLINE;	//여러 코스중에서 하나
			xmlData += '	<Course>' + NEWLINE;	//여러 코스중에서 하나
		}
	}

	/**
	 * 소수점 자리수는 6자리를 사용, xml 파일 크기를 줄이기 위함
	 * 웨이포인트를 계산할때는 시작과 끝을 보여주지만 실제 가민에서는 사용하면 시작과 끝을 추가해서 보여주므로
	 * 저잘할때는 제거하고 저장한다.
	 * @param waypoint
	 */
	function gpxWaypoint(waypoint) {
		if (_filetype === 'gpx') {
			for (let i = 0; i < waypoint.length; i++) {
				let wpt = waypoint[i];

				if(i == 0 || i == waypoint.length - 1) //Remove at first and last
					continue;

				xmlData += '	<wpt lat="' + wpt.point.lat.toFixed(6) +
					'" lon="' + wpt.point.lng.toFixed(6) + '">' + NEWLINE;
				xmlData += '		<name>' + wpt.symbolName + '</name>' + NEWLINE;
				xmlData += '		<sym>' + wpt.symbol + '</sym>' + NEWLINE;
				xmlData += '		<time>' + wpt.time + '</time>' + NEWLINE;
				xmlData += '	</wpt>' + NEWLINE;
			}
		} else {
			for (let i = 0; i < waypoint.length; i++) {
				let wpt = waypoint[i];

				if(i == 0 || i == waypoint.length - 1) //Remove at first and last
					continue;

				xmlData += '		<CoursePoint>' + NEWLINE;
				xmlData += '			<Name>' + wpt.symbolName + '</Name>' + NEWLINE;
				xmlData += '			<Time>' + wpt.time+ '</Time>' + NEWLINE;
				xmlData += '			<Position>' + NEWLINE;
				xmlData += '				<LatitudeDegrees>'+ wpt.point.lat.toFixed(6) +'</LatitudeDegrees>' + NEWLINE;
				xmlData += '				<LongitudeDegrees>'+ wpt.point.lng.toFixed(6) +'</LongitudeDegrees>' + NEWLINE;
				xmlData += '			</Position>' + NEWLINE;
				xmlData += '			<PointType>'+ wpt.symbol.charAt(0).toUpperCase()+wpt.symbol.slice(1)+'</PointType>' + NEWLINE;
				xmlData += '		</CoursePoint>' + NEWLINE;
			}
		}
	}

	function gpxTrack(trackArray) {
		if (_filetype === 'gpx') {
			xmlData += '	<trk>' + NEWLINE;
			xmlData += '		<trkseg>' + NEWLINE;
			for (let i = 0; i < trackArray.length; i++) {
				let track = trackArray[i];
				xmlData += '		<trkpt lat="' + track.lat.toFixed(6) +
					'" lon="' + track.lng.toFixed(6) + '">' + NEWLINE;
				xmlData += '			<ele>' + Math.round(track.ele) + '</ele>' + NEWLINE;
				xmlData += '		</trkpt>' + NEWLINE;
			}
			xmlData += '		</trkseg>' + NEWLINE;
			xmlData += '	</trk>' + NEWLINE;
			xmlData += '</gpx>' + NEWLINE;
		} else {
			let diff = new Date(trackArray[trackArray.length - 1].time) - new Date(BASETIME);
			xmlData += '		<Speed>'+ $('#averageV').val() +'</Speed>' + NEWLINE;
			xmlData += '		<Name>'+ $('#gpx_metadata_name').val()+'</Name>' + NEWLINE;
			xmlData += '		<Lap>' + NEWLINE;
			xmlData += '			<TotalTimeSeconds>' + diff / 1000 +'</TotalTimeSeconds>' + NEWLINE;
			xmlData += '			<DistanceMeters>' + trackArray[trackArray.length - 1].distance + '</DistanceMeters>' + NEWLINE;
			xmlData += '			<BeginPosition>' + NEWLINE;
			xmlData += '				<LatitudeDegrees>' + trackArray[0].position.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
			xmlData += '				<LongitudeDegrees>' + trackArray[0].position.lng.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
			xmlData += '			</BeginPosition>' + NEWLINE;
			xmlData += '			<EndPosition>' + NEWLINE;
			xmlData += '				<LatitudeDegrees>' + trackArray[trackArray.length - 1].position.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
			xmlData += '				<LongitudeDegrees>' + trackArray[trackArray.length - 1].position.lat.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
			xmlData += '			</EndPosition>' + NEWLINE;
			xmlData += '			<Intensity>Active</Intensity>' + NEWLINE;
			xmlData += '		</Lap>' + NEWLINE;
			xmlData += '		<Track>' + NEWLINE;
			for (let i = 0; i < trackArray.length; i++) {
				let track = trackArray[i];
				xmlData += '			<Trackpoint>' + NEWLINE;
				xmlData += '				<Time>'+ track.time+'</Time>' + NEWLINE;
				xmlData += '				<Position>' + NEWLINE;
				xmlData += '					<LatitudeDegrees>' + track.position.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
				xmlData += '					<LongitudeDegrees>' + track.position.lng.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
				xmlData += '				</Position>' + NEWLINE;
				xmlData += '				<AltitudeMeters>' + Math.round(track.position.ele) + '</AltitudeMeters>' + NEWLINE;
				xmlData += '				<DistanceMeters>'+ track.distance +'</DistanceMeters>' + NEWLINE;
				xmlData += '			</Trackpoint>' + NEWLINE;
			}
			xmlData += '		</Track>' + NEWLINE;
			xmlData += '	</Course>' + NEWLINE;
			xmlData += '</Courses>' + NEWLINE;
			xmlData += '</TrainingCenterDatabase>' + NEWLINE;

		}
	}