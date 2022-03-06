
## [http://giljabi.kr](http://giljabi.kr/)
### [https://giljabi.tistory.com/](https://giljabi.tistory.com/)
### [https://gpxtcx.tistory.com/](https://gpxtcx.tistory.com//)

## openrouteservice, google elevation api
* 경로탐색을 위한 api, 구글 고도정보를 가져오는 api 사용하는 방법을 공유합니다
  나중에는 경로탐색도 구글을 사용하게 변경할 예정입니다.


## 소스 공유
### Tistory : [giljabi.tistory.com](https://giljabi.tistory.com/) 소스 공유
### github : [https://github.com/parknamjun/giljabi](https://github.com/parknamjun/giljabi)
* 사용법 http://localhost:8080/giljabi.html
* Frontend 부분은 제일 아렵습니다. 그래서 UI가 매우 과거형입니다. 
  원래 사용목적이 경로만 만드는것이라 기본에는 충실하고자 하였습니다.
* 다음 버전은 경로를 직접 그리고 다음지도에서 제공하지 않는 높이정보을 구글지도 API에서 가져와서 gpx 파일을 만드는 방법을 
  하려고 합니다.
  
![메인화면](./images/image01.png)

* [openrouteservice.org](https://openrouteservice.org/)
* [openrouteservice-docs](https://github.com/GIScience/openrouteservice-docs)
* [google elevation api](https://developers.google.com/maps/documentation/elevation/start)

API 테스트 방법
1. 경로탐색
.http 파일의 내용을 참고
```
GET http://localhost:8080/api/1.0/route?start=127.01117,37.5555&target=126.99448,37.54565&direction=cycling-road
Content-Type: application/json
```   

2. 높이정보 
```
POST http://localhost:8090/api/1.0/elevation
Content-Type: application/json

{
"trackPoint":[
{"lng":127.03178,"lat":37.59244},
{"lng":127.03221,"lat":37.59245},
{"lat":37.59234,"lng":127.03322},
{"lat":37.59161,"lng":127.03348},
{"lat":37.59173,"lng":127.03391},
{"lat":37.59197,"lng":127.03438},
{"lat":37.59217,"lng":127.03472},
{"lat":37.59242,"lng":127.03514},
{"lat":37.59236,"lng":127.03522},
{"lat":37.59247,"lng":127.03557},
{"lat":37.59247,"lng":127.0361},
{"lat":37.59245,"lng":127.03618},
{"lat":37.59241,"lng":127.03635},
{"lat":37.59197,"lng":127.03634}
]
}
```

## gpx
```
?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1"
creator="giljabi"
version="1.1"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<metadata>
<name>2019-홍천그란폰도</name>
  <link href="http://www.giljabi.kr"></link>
  <desc>giljabi</desc>
  <copyright>giljabi</copyright>
  <speed>15</speed>
</metadata>
    <!-- 웨이포인트 반복 -->
	<wpt lat="37.70807408255889" lon="127.9078544749572">
		<name>1</name>
		<sym>danger</sym>
		<time>2022-01-01T00:00:00Z</time>
	</wpt>
	<trk>
		<trkseg>
            <!-- 반복 -->
			<trkpt lat="37.70807408255889" lon="127.9078544749572">
				<ele>139.3631744384766</ele>
			</trkpt>
		</trkseg>
	</trk>
</gpx>
```


### 현재는 1개 경로만 사용합니다.
## tcx
```
<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
<Folders>
	<Courses>
		<CourseFolder Name="giljabi.kr">
			<CourseNameRef>
				<Id>7</Id>
				<Author>Giljabi</Author>
			</CourseNameRef>
		</CourseFolder>
	</Courses>
</Folders>
	<Course>
		<CoursePoint>		<!-- 반복 -->
			<Name>START</Name>
			<Time>2022-01-01T00:00:00.000Z</Time>
			<Position>
				<LatitudeDegrees>37.708074</LatitudeDegrees>
				<LongitudeDegrees>127.907854</LongitudeDegrees>
			</Position>
			<PointType>start</PointType>
		</CoursePoint>
		<Speed>15</Speed>
		<Name>2019-홍천그란폰도</Name>
		<Lap> <!-- 시작에서 끝 지점 정보 -->
			<TotalTimeSeconds>266</TotalTimeSeconds>
			<DistanceMeters>1146</DistanceMeters>
			<BeginPosition>
				<LatitudeDegrees>37.70807408255889</LatitudeDegrees>
				<LongitudeDegrees>127.9078544749572</LongitudeDegrees>
			</BeginPosition>
			<EndPosition>
				<LatitudeDegrees>37.70419318700026</LatitudeDegrees>
				<LongitudeDegrees>37.70419318700026</LongitudeDegrees>
			</EndPosition>
			<Intensity>Active</Intensity>
		</Lap>
		<Track>
			<Trackpoint> <!-- 반복 -->
				<Time>2022-01-01T00:00:00.000Z</Time>
				<Position>
					<LatitudeDegrees>37.708074</LatitudeDegrees>
					<LongitudeDegrees>127.907854</LongitudeDegrees>
				</Position>
				<AltitudeMeters>139</AltitudeMeters>
				<DistanceMeters>0</DistanceMeters>
			</Trackpoint>
    	</Track>
	</Course>
</Courses>
</TrainingCenterDatabase>
    		
		
		


```
