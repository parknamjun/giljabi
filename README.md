
#### 파일을 지도에 올리는 것은 gpx 파일만 사용 가능하고, 저장은 gpx, tcx 가능합니다. tcx 파일 올리는 것은 준비중입니다.  

### [http://giljabi.kr](http://giljabi.kr/) 초기버전은 AWS Light sail를 사용하고 있으며 아래에 설명이 있습니다.
* [AWS Lightsail apache tomcat 설치 그리고 운영](https://gpxtcx.tistory.com/11)
* [gpx2tcx 변환/병합과 웨이포인트 작성 웹 소개](https://gpxtcx.tistory.com/3)
* [giljabi 시작과 현재 소개글](https://gpxtcx.tistory.com/13)

### [https://giljabi.tistory.com/](https://giljabi.tistory.com/) 소스공유 설명 블로그
### [https://gpxtcx.tistory.com/](https://gpxtcx.tistory.com//) 경로공유 블로그 



## since 2018.10.26
블로그 첫글(https://gpxtcx.tistory.com/1)에도 있습니다먼, 개인적으로 불편함이 시작이었습니다.
가민520 사용하면서 제대로 사용하려면 tcx/gpx등의 파일을 만들어서 사용해야 하는데 가민에서 제공하는 것과 다른 툴들이
불편하고 한글문제등의 많은 이슈가 있더군요

그래서 파일을 열어보니 그냥 xml 파일이라 이거 한번 해볼까해서 하다보니 웹페이지도 만들고 
구글 애드센스, 카카오애드핏도 해보고 다양한 경험을 하게 되었습니다. 아직 수익 전환기준이 안되어 그림의 떡입니다. 

공개를 하려니 막 코딩 부분정리가 아직도 잘 안됩니다. 특히 javascript는 요즘 유행하는 프레임워크를 쓰면 
좋겠습니다만, react, vue등을 볼 여유가 없네요

진행 예정인 부분은 UI부분에서 tcx loagin 그리고 elevation, route api 호출시 경로정보를 DB에 저장하는 것을 JPA를 이용하는 것을 추가하는 것입니다. 
오래전 struts 기반으로 만든 프레임워크에 너무 익숙해서 spring의 어노테이션을 보면서 당황스러웠지만 세상이 변했으니 함께 변해야겠습니다. 
JPA 온라인 강의도 들었고, DB는 mysql/h2를 이용할 계획입니다.

현재 운영중인 (http://giljabi.kr)은 mysql, struts를 기반으로 개벌되었습니다.



## 로컬 환경에서 사용가능
* spring boot 기반으로 tomcat이 내장되어 있어 java(1.8 권장)만 설치되어 있으면 사용 가능합니다.
* gpx, tcx 파일 만드는 것을 javascript로 구현하여 openrouteservice apikey가 없어도 웨이포인트 작성해서 가민등에서 사용할 수 있습니다.
* api key 노출이 되면 안되는 openrouteservice, google api를 사용하는 것만 api로 작성되어 있습니다.


## openrouteservice, google elevation api
* 경로탐색을 위한 api, 구글 고도정보를 가져오는 api 사용하는 방법을 공유합니다
  나중에는 경로탐색도 구글을 사용하게 변경할 예정입니다.


## 소스 공유
### github : [https://github.com/parknamjun/giljabi](https://github.com/parknamjun/giljabi)
* 사용법 http://localhost:8080/giljabi.html
* Frontend 부분은 역시나 어렵네요, UI를 구성하는 방법과 구현방법이 최근 유행하는 방법과 프레임워크를 사용하지 않았습니다.  
  원래 사용목적이 경로를 만들고 사용하는 것이 주된 용도이므로 기본에는 충실하고자 하였습니다.
  
![메인화면](./images/image01.png)

* [openrouteservice.org](https://openrouteservice.org/)
* [openrouteservice-docs](https://github.com/GIScience/openrouteservice-docs)
* [google elevation api](https://developers.google.com/maps/documentation/elevation/start)

* [지도 경로탐색 오픈API 소개(OpenRouteService)](https://gpxtcx.tistory.com/38)
* [openrouteservice api 사용](https://giljabi.tistory.com/2)


API 테스트 방법
1. API key 설정 
   
   application.yml에 위 사이트에서 발급받은 key 값을 각각 넣어줍니다.
```
giljabi:
  openrouteservice:
    apikey: 1234567890.....
    directionUrl: https://api.openrouteservice.org/v2/directions/%s/json
  google:
    elevation:
      googleGetCount: 400
      apikey: ABCDEFGH..........
      elevationUrl: https://maps.googleapis.com/maps/api/elevation/json
```

2. 경로탐색
.http 파일의 내용을 참고
```
GET http://localhost:8080/api/1.0/route?start=127.01117,37.5555&target=126.99448,37.54565&direction=cycling-road
Content-Type: application/json
```   

3. 높이정보 
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

4. 테이블 생성
 테이블은 현재 사용한 사용자의 IP를 기준으로 이력을 저장하는 테이블을 2개 사용합니다. 사용이력 테이블(api_call_info), IP별 누적 사용현황(client_info)을 사용합니다.
 
 mybtis등을 사용하면 간편하지만, 학습중인 JPA를 사용하였습니다. 기본 기능인 insert/update를 사용하고 있습니다.
 
 
 docs/script/schema.sql을 mysql or h2에 생성합니다. 아니면
``` 
 hibernate:
   ddl-auto: create
```
이렇게 설정되어 있으면 drop table 후 create table을 해줍니다.


## GPX & TCX 사양
* [https://en.wikipedia.org/wiki/Training_Center_XML](https://en.wikipedia.org/wiki/Training_Center_XML)
* [https://en.wikipedia.org/wiki/GPS_Exchange_Format](https://en.wikipedia.org/wiki/GPS_Exchange_Format)


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
