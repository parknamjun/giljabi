# giljabi

# [http://giljabi.kr](http://giljabi.kr/)


## openrouteservice, google elevation api
경로탐색을 위한 api, 구글 고도정보를 가져오는 api 사용하는 방법을 공유합니다
나중에는 경로탐색도 구글을 사용하게 변경할 예정입니다.

# [giljabi.tistory.com](https://giljabi.tistory.com/) 소스 공유
# [gpxtcx.tistory.com](https://gpxtcx.tistory.com/) 다양한 경로 공유

* [openrouteservice.org](https://openrouteservice.org/)
* [openrouteservice-docs](https://github.com/GIScience/openrouteservice-docs)
* [google elevation api](https://developers.google.com/maps/documentation/elevation/start)

테스트 방법
1. 경로탐색

.http 파일의 내용을 참고
profile : cycling-road, cycling-mountain, driving-car, foot-walking외 다양한 경로를 찾을 수 있습니다. 
GET http://localhost:8090/api/1.0/route

Content-Type: application/json

{
"start_lat": 37.58052832938857,
"start_lng": 127.021374295649,
"target_lat": 37.58340695922779,
"target_lng": 127.0391273352651,
"profile": "cycling-road"
}

2. 높이정보

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

