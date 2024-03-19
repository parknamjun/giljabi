let xmlData;
let NEWLINE = '\n';

function gpxHeader() {
    xmlData = '';	//저장할떼마다 초기화
    xmlData += '<?xml version="1.0" encoding="UTF-8"?>' + NEWLINE;
    if (_filetype === 'gpx') {
        xmlData += '<gpx creator="Giljabi" version="1.1"' + NEWLINE;
        xmlData += '	 xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd"' + NEWLINE;
        xmlData += '	 xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"' + NEWLINE;
        xmlData += '	 xmlns="http://www.topografix.com/GPX/1/1"' + NEWLINE;
        xmlData += '	 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3">' + NEWLINE;
    } else {
        xmlData += '<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"' + NEWLINE;
        xmlData += ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + NEWLINE;
        xmlData += ' xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">' + NEWLINE;
    }
}

function gpxMetadata(filename, velocity, time) {
    if (_filetype === 'gpx') {
        xmlData += '<metadata>' + NEWLINE;
        xmlData += '  <name>' + filename + '</name>' + NEWLINE;
        xmlData += '  <link href="http://www.giljabi.kr" />' + NEWLINE;
        xmlData += '  <desc>giljabi</desc>' + NEWLINE;
        xmlData += '  <copyright>giljabi.kr</copyright>' + NEWLINE;
        xmlData += '  <speed>' + velocity + '</speed>' + NEWLINE;
        xmlData += '  <time>' + time + '</time>' + NEWLINE;
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
        xmlData += '		<Speed>' + $('#averageV').val() + '</Speed>' + NEWLINE;
        xmlData += '		<Name>' + $('#gpx_metadata_name').val() + '</Name>' + NEWLINE;

    }
}


/**
 * tcx lap
 * @param firstPoint
 * @param lastPoint
 */
function makeTcxLap(firstPoint, lastPoint) {
    let diff = new Date(lastPoint.time) - new Date(BASETIME);
    xmlData += '		<Lap>' + NEWLINE;
    xmlData += '			<TotalTimeSeconds>' + diff / 1000 + '</TotalTimeSeconds>' + NEWLINE;
    xmlData += '			<DistanceMeters>' + lastPoint.distance + '</DistanceMeters>' + NEWLINE;
    xmlData += '			<BeginPosition>' + NEWLINE;
    xmlData += '				<LatitudeDegrees>' + firstPoint.position.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
    xmlData += '				<LongitudeDegrees>' + firstPoint.position.lng.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
    xmlData += '			</BeginPosition>' + NEWLINE;
    xmlData += '			<EndPosition>' + NEWLINE;
    xmlData += '				<LatitudeDegrees>' + lastPoint.position.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
    xmlData += '				<LongitudeDegrees>' + lastPoint.position.lng.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
    xmlData += '			</EndPosition>' + NEWLINE;
    xmlData += '			<Intensity>Active</Intensity>' + NEWLINE;
    xmlData += '		</Lap>' + NEWLINE;
    //xmlData += '		<Track>' + NEWLINE;
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

            xmlData += '	<wpt lat="' + wpt.point.lat.toFixed(6) +
                '" lon="' + wpt.point.lng.toFixed(6) + '">' + NEWLINE;
            xmlData += '		<name>' + wpt.symbolName + '</name>' + NEWLINE;
            xmlData += '		<sym>' + wpt.symbol + '</sym>' + NEWLINE;
            //xmlData += '		<time>' + wpt.time + '</time>' + NEWLINE;
            xmlData += '	</wpt>' + NEWLINE;
        }
    } else {
        for (let i = 0; i < waypoint.length; i++) {
            let wpt = waypoint[i];

            if (i == 0 || i == waypoint.length - 1) //Remove at first and last
                continue;

            //milisecond 제거
            let time = wpt.time.substr(0, wpt.time.length - 5) + 'Z';
            xmlData += '		<CoursePoint>' + NEWLINE;
            xmlData += '			<Name>' + wpt.symbolName + '</Name>' + NEWLINE;
            xmlData += '			<Time>' + time + '</Time>' + NEWLINE;
            xmlData += '			<Position>' + NEWLINE;
            xmlData += '				<LatitudeDegrees>' + wpt.point.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
            xmlData += '				<LongitudeDegrees>' + wpt.point.lng.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
            xmlData += '			</Position>' + NEWLINE;
            xmlData += '			<PointType>' + wpt.symbol.charAt(0).toUpperCase() + wpt.symbol.slice(1) + '</PointType>' + NEWLINE;
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
            xmlData += '			<time>' + track.time + '</time>' + NEWLINE;
            xmlData += '			<desc>' + track.dist + '</desc>' + NEWLINE;
            xmlData += '		</trkpt>' + NEWLINE;
        }
        xmlData += '		</trkseg>' + NEWLINE;
        xmlData += '	</trk>' + NEWLINE;
        xmlData += '</gpx>' + NEWLINE;
    } else {
        xmlData += '		<Track>' + NEWLINE;
        for (let i = 0; i < trackArray.length; i++) {
            let track = trackArray[i];
            let time = track.time.substr(0, track.time.length - 5) + 'Z';

            xmlData += '			<Trackpoint>' + NEWLINE;
            xmlData += '				<Time>' + time + '</Time>' + NEWLINE;
            xmlData += '				<Position>' + NEWLINE;
            xmlData += '					<LatitudeDegrees>' + track.position.lat.toFixed(6) + '</LatitudeDegrees>' + NEWLINE;
            xmlData += '					<LongitudeDegrees>' + track.position.lng.toFixed(6) + '</LongitudeDegrees>' + NEWLINE;
            xmlData += '				</Position>' + NEWLINE;
            xmlData += '				<AltitudeMeters>' + Math.round(track.position.ele) + '</AltitudeMeters>' + NEWLINE;
            xmlData += '				<DistanceMeters>' + track.distance + '</DistanceMeters>' + NEWLINE;
            xmlData += '			</Trackpoint>' + NEWLINE;
        }
        xmlData += '		</Track>' + NEWLINE;
    }
}

function tcxClose() {
    xmlData += '	</Course>' + NEWLINE;
    xmlData += '</Courses>' + NEWLINE;
    xmlData += '</TrainingCenterDatabase>' + NEWLINE;
}
