/**
 * 2018.10.26 gpx to tcx Project start....
 * Author : park namjun, eahn.park@gmail.com
 *
 https://www.topografix.com/GPX/1/1
 Element: gpx
 Complex Type: gpxType
 Complex Type: metadataType
 Complex Type: wptType
 Complex Type: rteType
 Complex Type: trkType
 Complex Type: extensionsType
 Complex Type: trksegType
 Complex Type: copyrightType
 Complex Type: linkType
 Complex Type: emailType
 Complex Type: personType
 Complex Type: ptType
 Complex Type: ptsegType
 Complex Type: boundsType
 Simple Type: latitudeType
 Simple Type: longitudeType
 Simple Type: degreesType
 Simple Type: fixType
 Simple Type: dgpsStationType

 */

let _newPosition;

let _map;
let _gpxMetadata = {};		//gpx/metadata
let _gpxTrkseqArray = [];		//gpx/trk/trkseq
let _eleArray = [];		//경로의 높이정보
let _chkRoute = false;
let _lastPoint;		//경로탐색을 위한 마지막 포인트
let _routeMarkerArray = [];	//경로탐색을 위한 마커
let _polyline = [];	//2개 이상의 경로를 배열로 보관
//let _place;	//장소 검색 객체
//let contentNode = document.createElement('div'); // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
let _keywordMarker = new kakao.maps.Marker();
let _mapLevel = 3;	//검색 후 지도 스케일
let _markings = [];	//고도차트를 그리기 위한 데이터리스트
let waypointSortByDistance = [];	//웨이포인트를 거리별로 정열된 배열
let _filetype = '';	//gpx, tcx 구분

//'2022-01-01T00:00:00Z';
let BASETIME = (new Date()).toISOString().split('T')[0];

$(document).ready(function() {
	//지도초기화
	let container = document.getElementById('map');
	let options = {
		center: getLocation(),	//사용자 위치 또는 서울시청
		level: 8 //default 8
	};
	
	_map = new kakao.maps.Map(container, options);

	// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
	let mapTypeControl = new kakao.maps.MapTypeControl();
	_map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

	/**
	 * 	 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
	 * 	 나중에 추가...
	kakao.maps.event.addListener(_map, 'dragend', function() {
		console.log(_certiFlag);
		removePoi(_markerList);
		let bounds = _map.getBounds();
		getPoi(_map, bounds, _map.getLevel());
		
		////searchPlaces();
	});

	kakao.maps.event.addListener(_map, 'zoom_changed', function() {
	    // 지도의 현재 레벨을 얻어옵니다
	    let level = _map.getLevel();
	    console.log('현재 지도 레벨은 ' + level + '입니다');

	    ////let bounds = _map.getBounds();
		////getPoi(_map, bounds, _map.getLevel());
		
		////searchPlaces();
	});
	*/

	function makeWaypointObject(latlng) {
		_microTime++;
		let info = {};
		info.position = latlng;
		info.name = '웨이포인트';
		info.sym = 'Generic';
		info.ele = '0';
		info.uid = _microTime;
		info.desc = '';
		return info;
	}

	//마우스 click event
	//var markersId = 0;
	let route = [];	//route api에서 사용하는 시작과 끝 위치정보
	kakao.maps.event.addListener(_map, 'click', function(mouseEvent) {
		if(_chkRoute) {	//waypoint ?, cycling/hiking ?
			if(route.length === 0)
				makeMarkerRoute(mouseEvent.latLng, 'daumstart.png');
		    
			route.push(mouseEvent.latLng); 
		    if(route.length === 2) {
		    	_lastPoint = route[1];	//마지막 포인트는 계속 저장한다
		    	getRoute(route);
		    	route.length = 0;
		    	route[0] = _lastPoint;	//마지막 포인트는 저장
		    }
		} else {
			let info = makeWaypointObject(mouseEvent.latLng);
			addWaypoint(info);
			console.log('kakao.maps.event.addListener click:' + info.position.toString());	//icon 좌표
		}
	});

	//만약, 웨이포인트가 start, end와 동일한 위치인 경우는 웨이포인트를 그리지 않는다.
	function addWaypoint(info) {
		info.sym = info.sym === '' ? 'Generic' : info.sym;	//Symbol이 없는 경우
		let myWayPoint = new Waypoint(_map, info.position, info.name, info.uid, info.sym);
		//position을 waypoint와 중복해서 사용하는 이유는 overlay에서 정보를 가져오기가 어렵네...
		_wayPointArray.push({ uid: info.uid,
			position : info.position,
			customoverlay : myWayPoint,
			waypointname : info.name,
			sym : info.sym,
			ele : info.ele
			});
	}

	$('.waypointIcon').click(function(){
		_pointIcon = this.id;
		$('#selectWaypointIcon').attr('src', 'images/' + _pointIcon + '.png');

		let name = $('#waypointName').val().toLowerCase();
		console.log(this.id + ',' + _waypointIcons.indexOf(name));
		//사용자가 입력한 웨이포인트 이름은 변경하지 않는다..
		if(_waypointIcons.indexOf(name) >= 0)
			$('#waypointName').val(capitalizeFirstLetter(_pointIcon));
	});

	//combo에서 direction 타입이 웨이포인트인지, 경로탐색인지 구분하느 플래그
	$('#direction').change(function(){
		 let test = $("#direction option:selected").val();
		 _chkRoute = test !== "waypoint";
		 console.log('direction flag:' + _chkRoute);
	});
 
	//=======================================================================
	//gpx file loading....
	$('#fileInput').change(function() {
		if (_firstFileOpenFlag) {
			alert('이미 기본 파일이 열려 있습니다.');
			return;
		} else {
			let file = document.getElementById('fileInput').files[0];
			_uploadFilename = file.name.substring(0, file.name.lastIndexOf('.'));			//파일명
			_fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();	//확장자
			_firstFileOpenFlag = true;

			let reader = new FileReader();
			reader.readAsText(file);

			reader.onload = function (e) {
				fileLoadAndDraw(reader.result);
				console.log('fileInput filename :' + _uploadFilename);	//필요하면 디버깅으로...
			};
		}
	});
		
	//javascript를 사용하면 서버의 부하를 줄일수 있고, 필요한 정보만 servlet에 요청 후 받아오게 한다.
	//makeObject
	function fileLoadAndDraw(xml) {
		let readXmlfile = $($.parseXML(xml.replace(/&/g, "&amp;")));
		console.log('fileLoadAndDraw:' + readXmlfile);

		if(_fileExt == 'gpx') {
			loadGpx(readXmlfile);
		} else if(_fileExt == 'tcx') {
			//loadTcx(readXmlfile); gpx 포맷을 끝내고 진행...
		}

		//시작과 끝 표시
		makeMarkerPoint(_map, 'start', _gpxTrkseqArray[0]);
		makeMarkerPoint(_map, 'end', _gpxTrkseqArray[_gpxTrkseqArray.length - 1]);
		
		drawPolyline(_trkPoly); //경로를 그린다.

		let midPoint = _gpxTrkseqArray[parseInt(_gpxTrkseqArray.length / 2)];
		_map.setCenter(new kakao.maps.LatLng(midPoint.lat, midPoint.lng)); //중심점을 경로상의 중간을 설정한다.
		_map.setLevel(10);

		getWaypointInfo();

		drawPlot();/////차트 테스트...나중에 여기서 빼야 함, 우측의 waypoint정보를 route에서 함께 가져오게 개선필요

	}

	/**
	 * gpx file loading
	 * @param loadFile
	 */
	function loadGpx(loadFile) {
		//정상적인 포맷에서 필요한 정보들...
		_gpxMetadata.author = loadFile.find('gpx').find('metadata').find('author').text();
		_gpxMetadata.name = loadFile.find('gpx').find('metadata').find('name').text();

		if(_gpxMetadata.name == "")
			$('#gpx_metadata_name').val(_uploadFilename);
		else
			$('#gpx_metadata_name').val(_gpxMetadata.name);

		_gpxMetadata.desc = loadFile.find('gpx').find('metadata').find('desc').text();
		_gpxMetadata.speed = loadFile.find('gpx').find('metadata').find('speed').text();
		if(_gpxMetadata.speed == "")
			$('#averageV').val('15');
		else
			$('#averageV').val(_gpxMetadata.speed);

		//gpx파일의 waypoint 정보
		$.each(loadFile.find('gpx').find('wpt'), function() {
			let item = new GpxWaypoint(
				Number($(this).attr('lat')),
				Number($(this).attr('lon')),
				Number($(this).find('ele')),
				$(this).find('name').text(),
				$(this).find('desc').text(),
				$(this).find('type').text(),
				getIconString($(this).find('sym').text())
			); //console.log('loadGpx item:' + item.toString());
			addWaypoint(item);
		});

		//경로정보
		$.each(loadFile.find('gpx').find('trk').find('trkseg').find('trkpt'), function() {
			let trackPoint = new Point3D(
				Number($(this).attr('lat')),
				Number($(this).attr('lon')),
				Number($(this).find('ele').text())
			);
			_gpxTrkseqArray.push(trackPoint);
			_trkPoly.push(new kakao.maps.LatLng(trackPoint.lat, trackPoint.lng));
		});
	}

	/**
	 * tcx file loading
	 * @param loadFile
	 */
	function loadTcx(loadFile) {
		let speed = loadFile.find('TrainingCenterDatabase').find('Courses').find('Course').find('Speed').text();
		_gpxMetadata.speed = speed == '' ? '15' : speed;
		$('#averageV').val(_gpxMetadata.speed);

		let pathname = loadFile.find('TrainingCenterDatabase').find('Courses').find('Course').find('Name').first().text();
		_gpxMetadata.name = pathname == '' ? 'giljabi' : pathname;
		$('#gpx_metadata_name').val(_gpxMetadata.name);

		//waypoint가 있는경우
		$.each(loadFile.find('CoursePoint'), function() {
			let item = new GpxWaypoint(
				$(this).find('LatitudeDegrees').text(),
				$(this).find('LongitudeDegrees').text(),
				'',
				$(this).find('Name').text(),		//웨이포인트 이름
				'',			//웨이포인트 설명
				'',			//sym 설명
				$(this).find('PointType').text());//console.log('loadGpx item:' + item.toString());
			//gpx파일 로딩시 waypoint가 있으면 그려준다.
			addWaypoint(item);
		});
		
		//경로
		$.each(loadFile.find('Trackpoint'), function() {
			let trackPoint = new Point3D(
				$(this).find('LatitudeDegrees').text(),
				$(this).find('LongitudeDegrees').text(),
				$(this).find('AltitudeMeters').text()
			);
			_gpxTrkseqArray.push(trackPoint);
			_trkPoly.push(new kakao.maps.LatLng(trackPoint.lat, trackPoint.lng));
		});
	}

	//var plot;
	function drawPlot() {
		$('#elevationImage').empty();
		let updateLegendTimeout = null;
		let latestPosition = null;
		let cursorMarker = new kakao.maps.Marker();

		let lastDistance = 0;					//이동거리
		let flag = true;						//다음값을 사용할것인지 결정
		let minAlti = 0, maxAlti = 0, curAlti = 0;	//높이정보
		let currentLat, currentLng, nextLat, nextLng;
		
		for(let i = 0; i < _gpxTrkseqArray.length; i++) {
			let pos = _gpxTrkseqArray[i];
			curAlti = Number(pos.ele);	//고도

			if(flag) { //다음값을 비교하기 위한 플래그
				minAlti = curAlti;
				maxAlti = curAlti;
				currentLat = pos.lat;
				currentLng = pos.lng;
				nextLat = pos.lat;
				nextLng = pos.lng;
			} else {
				nextLat = pos.lat;
				nextLng = pos.lng;
			}
			
			if(curAlti >= maxAlti) maxAlti = curAlti; //전체 경로에서 최대높이
			if(curAlti <= minAlti) minAlti = curAlti; //전체 경로에서 최저높이

			lastDistance += getDistance(new Point3D(currentLat, currentLng), new Point3D(nextLat, nextLng));

			//누적거리와 고도정보
			_eleArray.push([lastDistance, Number(pos.ele)]);
			if(flag === false) {
				currentLat = nextLat;
				currentLng = nextLng;
			}
			flag = false;
		}

		//참고 http://www.flotcharts.org/flot/examples/tracking/index.html
		//위치정보 http://www.flotcharts.org/flot/examples/interacting/index.html
		//zoom http://www.flotcharts.org/flot/examples/selection/index.html
		//http://www.flotcharts.org/flot/examples/annotating/index.html
		//http://www.flotcharts.org/flot/examples/basic-options/index.html
		//plot = $.plot("#elevationImage", [{ data: _eleArray}, { data: horiArray}]
		let plot = $.plot("#elevationImage", [{ data: _eleArray}]
			, {
			series: { lines: { show: true }},
			crosshair: { mode: "x"},
			grid: {	clickable:true, hoverable: true, show:true, aboveData : true
				, markings: _markings/*getWaypointPositionInfo() 나중에 추가 */},
			yaxis: { min: minAlti * 0.7, max: maxAlti * 1.2, auto:'none'} //위/아래 여백
		});
		
		function updateLegend() {
			updateLegendTimeout = null;
			let pos = latestPosition;
			let dataset = plot.getData();
			let dataIndex, seriesIndex;
			for (dataIndex = 0; dataIndex < dataset.length; ++dataIndex) {	//차트는 N개
				let series = dataset[dataIndex];
				for (seriesIndex = 0; seriesIndex < series.data.length; ++seriesIndex) {
					if (series.data[seriesIndex][0] > pos.x) {
						break;
					}
				}
				//console.info(seriesIndex);
				//고도차트에서 마무스를 따라 움직이는 지도상의 마커
				cursorMarker.setMap(null);	//마커를 삭제하고
				try {
					//마지막 포인트는 예외로 처리한다.
					cursorMarker = new kakao.maps.Marker({
						position: new kakao.maps.LatLng(_gpxTrkseqArray[seriesIndex].lat, _gpxTrkseqArray[seriesIndex].lng)
					});
				} catch (e) {

				}
				cursorMarker.setMap(_map);
			}
		}
		
		//고도정보
		$("<div id='tooltip'></div>").css({
			position: "absolute",
			display: "none",
			border: "1px solid #fdd",
			padding: "2px",
			"background-color": "#fee",
			opacity: 0.80
		}).appendTo("body");
		
		//차트에서 마우스의 움직임이 있으면....
		$("#elevationImage").bind("plothover",  function (event, pos, item) {
			latestPosition = pos;
			if (!updateLegendTimeout) {
				updateLegendTimeout = setTimeout(updateLegend, 50);
			}
			
			if(item) {
				let x = item.datapoint[0].toFixed(1),
					y = item.datapoint[1].toFixed(0);

				$("#tooltip").html(x + ' / ' + y)
					.css({top: item.pageY+5, left: item.pageX+5})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}
		});
		_eleArray = [];
	}
/*
	function getWaypointList() {
		let wpt = new Array();
		for(let i = 0; i < _wayPointArray.length; i++) {
			wpt.push( {
				  lat: _wayPointArray[i].position.getLat()
				, lng: _wayPointArray[i].position.getLng()
				, name: _wayPointArray[i].waypointname
				, sym: _wayPointArray[i].sym
			});
		}
		return wpt;
	}
*/
	$('#reset').click(function(){
		if(confirm('초기화 할까요?'))
			location.href='/giljabi.html';
	});
	
	$('#waypointinfo').click(function(){
		if(_wayPointArray.length === 0) {
			alert('웨이포인트가 없습니다. 경로상에 웨이포인트가 1개 이상 있어야 합니다.');
		} else
			getWaypointInfo();
	});

	//gpx파일을 병합한다.
	$('#mergeInput').change(function() { 
		if(!_firstFileOpenFlag) {
			alert('GPX/TCX 파일을 먼저 선택해야 병합 파일을 열 수 있습니다.');
			return;
		}
		
		let file = document.getElementById('mergeInput').files[0];
		_fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
		let reader = new FileReader();
		reader.onload = function(e) {
			mergeObject(reader.result);
		};
		reader.readAsText(file);
	});

	//직전의 경로에 경로를 이어 붙힌다
	function mergeObject(xml) {
		let _xmlData = $($.parseXML(xml));
		/*
		let endPosition = new kakao.maps.LatLng(
				  _gpxTrkseqArray[_gpxTrkseqArray.length - 1].lat
				, _gpxTrkseqArray[_gpxTrkseqArray.length - 1].lon);
		*/
		let endPosition = _gpxTrkseqArray[_gpxTrkseqArray.length - 1];

		let nearDistance = 0;	//최단거리
		let currDistance = 0;	//현재거리
		let startIndex = 0;
		let polyline = new Array();	//추가된 선을 그린다.
		polyline.push(new kakao.maps.LatLng(
				  _gpxTrkseqArray[_gpxTrkseqArray.length - 1].lat
				, _gpxTrkseqArray[_gpxTrkseqArray.length - 1].lng)); //마지막 위치에서 연결
		
		if(_fileExt == 'gpx') {
			//직전 경로의 마지막 위치와 현재 업로드된 경로에서 가장 가까운 위치를 찾아서 시작 위치로 한다. 이게 필요할까????
			let trkSeqArray = _xmlData.find('trkpt');
			for(let i = 0; i < trkSeqArray.length; i++) {
				currDistance = getDistance(new Point3D(endPosition.lat, endPosition.lng),
					new Point3D($(trkSeqArray[i]).attr('lat'), $(trkSeqArray[i]).attr('lon')));

				console.info(
					endPosition,
					$(trkSeqArray[i]).attr('lat'), $(trkSeqArray[i]).attr('lon'),
					currDistance);
				if(currDistance <= nearDistance) {
					nearDistance = currDistance;
					startIndex = i;
				}
			}

			//병합할 경로에서 필요없는 부분을 제거한다.
			trkSeqArray.splice(0, startIndex);
			//console.log("nearDistance:" + nearDistance +', index:' + startIndex);
			$.each(trkSeqArray, function() {
				//trkpt
				let trackPoint = new Point3D(
					$(this).attr('lat'),
					$(this).attr('lon'),
					$(this).find('ele').text());

				_gpxTrkseqArray.push(trackPoint);
				polyline.push(new kakao.maps.LatLng(trackPoint.lat, trackPoint.lng));
			});

			//waypoint가 있는경우 모두 넣어준다. 잘라내기 어려워서... 입력 후 손으로 지우는게 편함.....
			////var wpt = _xmlData.find('gpx').find('wpt');
			$.each(_xmlData.find('gpx').find('wpt'), function() {		
				let item = GpxWaypoint(
					$(this).attr('lat'),
					$(this).attr('lon'),
					$(this).find('ele').text(),
					$(this).find('name').text(),
					$(this).find('desc').text(),
					$(this).find('type').text(),
					getIconString($(this).find('sym').text())
				);
				//gpx파일 로딩시 waypoint가 있으면 그려준다.
				addWaypoint(item);
			});
		} else if(_fileExt == 'tcx') {	//tcx를 빼고 할까????
			var trkSeqArray = _xmlData.find('Trackpoint');
			for(var i = 0; i < trkSeqArray.length; i++) {
				var temp = $(trkSeqArray[i]);
				currDistance = getDistanceFromLatLon(endPosition.getLat(), endPosition.getLng()
						, temp.find('LatitudeDegrees').text()
						, temp.find('LongitudeDegrees').text());
				if(currDistance <= nearDistance) {
					nearDistance = currDistance;
					startIndex = i;
				}
			}
			//병합할 경로에서 필요없는 부분을 제거한다.
			trkSeqArray.splice(0, startIndex - 1);
			//console.log("nearDistance:" + nearDistance +', index:' + startIndex);
			$.each(trkSeqArray, function() {
				var trkpt = getGpxTrk($(this).find('LatitudeDegrees').text()
						, $(this).find('LongitudeDegrees').text()
						, $(this).find('AltitudeMeters').text());
				_gpxTrkseqArray.push(trkpt);
				polyline.push(new daum.maps.LatLng($(this).find('LatitudeDegrees').text()
						, $(this).find('LongitudeDegrees').text()));
			});

			//waypoint가 있는경우 
			$.each(_xmlData.find('CoursePoint'), function() {		
				var wptitem = new Object();
				wptitem.uid = _microTime++;
				wptitem.position = new kakao.maps.LatLng($(this).find('LatitudeDegrees').text()
						, $(this).find('LongitudeDegrees').text());
				wptitem.ele = '';
				wptitem.name = $(this).find('Name').text();		//웨이포인트 이름
				wptitem.desc = '';		//웨이포인트 설명
				wptitem.type = '';		//sym 설명
				wptitem.sym = $(this).find('PointType').text();

				//gpx파일 로딩시 waypoint가 있으면 그려준다.
				addWaypoint(wptitem);
			});
			
		}
		
		//끝점만 표시
		makeMarkerPoint(_map, 'end', _gpxTrkseqArray[_gpxTrkseqArray.length - 1]);
		drawPolyline(polyline);

		drawPlot();
	}	
	
	function drawPolyline(polyline) {
 	 	// 지도에 표시할 선을 생성합니다
		let lineStyle = new kakao.maps.Polyline({
		    path: polyline, // 선을 구성하는 좌표배열
		    strokeWeight: 5, // 선의 두께
		    strokeColor: '#FF0000', // 선의 색깔
		    strokeOpacity: 0.7, // 선의 불투명도, 1에서 0 사이의 값이며 0에 가까울수록 투명
		    strokeStyle: 'solid' // 선의 스타일
		});
		// 지도에 선을 표시합니다 
		lineStyle.setMap(_map);
		_polyline.push(lineStyle);
	}

	//경로 뒤집기...
	$('#reverse').click(function(){
		console.info('reverse');

		if(_gpxTrkseqArray.length == 0) {
			alert('경로가 없습니다.');
			return;
		}

		//경로, 웨이포인트 재계산 해야 함
		_gpxTrkseqArray = _gpxTrkseqArray.reverse();
		_wayPointArray = _wayPointArray.reverse();
		
		getWaypointInfo();
	});


	/**
	 * 시작위치에서 목표위치까지의 경로를 찾는다..
	 * @param route
	 */
	function getRoute(route) {
		$('#blockingAds').show();
		let polyline = new Array();	//추가된 선을 그린다.
		$.ajax({
			type: 'get',
			url : '/api/1.0/route',
			dataType:'json',
			contentType : 'application/json; charset=UTF-8;',
			data: {
				start : route[0].getLng() + ',' + route[0].getLat()
				, target : route[1].getLng() + ',' + route[1].getLat()
				, direction : $('#direction option:selected').text()
			},
			async : true,
			complete: function() {
				
			},
			success:function(response, status) {
				if(response.status == 200) {
					//_gpxTrkseqArray = []; //chkRoute의 체크 유무에 따라 초기화를 결정해야 한다.
					//eleFalg = true;
					///////var jsonList = JSON.parse(response.data);
					$.each(response.data, function() {
						let trackPoint = new Point3D(
							$(this).attr('lat'),
							$(this).attr('lng'),	//api에서 받은 데이터
							$(this).attr('ele'));
						_gpxTrkseqArray.push(trackPoint);
						polyline.push(new kakao.maps.LatLng(trackPoint.lat, trackPoint.lng));
					});
					//makeMarkerRoute(_gpxTrkseqArray[0]);
					//makeMarkerRoute(_gpxTrkseqArray[_gpxTrkseqArray.length - 1]);
					drawPolyline(polyline);
					drawPlot();/////차트 테스트...나중에 여기서 빼야 함, 우측의 waypoint정보를 route에서 함께 가져오게 개선필요
					/////getWaypointInfo();
					makeMarkerRoute(_lastPoint, 'daumend.png');
				} else {
					//eleFalg = false;
					alert(data.resultmessage);
				}
				$('#blockingAds').hide();
			}
		});
	}

	//경로탐색의 마크를 사용
	function makeMarkerRoute(latlon, image) {
		console.info('makeMarkerRoute:' + latlon + ', image:' + image);

		let currentMarkerPosition = _routeMarkerArray.length;

		let markerObject = {};

		markerObject.currPosition = _gpxTrkseqArray.length;
		markerObject.prevPosition = _routeMarkerArray.length > 0 ? _routeMarkerArray[_routeMarkerArray.length - 1].currPosition : 0;

		let imageSize = new kakao.maps.Size(50, 45);
		let startOption = {
			offset: new kakao.maps.Point(35, 0) // 출발 마커이미지에서 마커의 좌표에 일치시킬 좌표를 설정, 기본값은 이미지의 가운데 아래
		};
	    let markerImage = new kakao.maps.MarkerImage('/images/' + image, imageSize, startOption);

		let marker = new kakao.maps.Marker({
	        position: latlon,
	        image : markerImage
	    });
		marker.setMap(_map);
		markerObject.marker = marker;
		_routeMarkerArray.push(markerObject);

		kakao.maps.event.addListener(marker, 'click', function() {
			if(_routeMarkerArray.length - 1 != currentMarkerPosition) {
				alert('삭제는 마지막 경로부터 가능합니다.');
				return;
			}
			if(!_chkRoute) {
				alert('웨이포인트 상태에서는 경로삭제가 안됩니다.');
				return;
			}
			
			markerObject.marker.setMap(null);	//Marker 삭제
			//var temp = _gpxTrkseqArray[markerObject.prevPosition];
			//_lastPoint = new daum.maps.LatLng(temp.lat, temp.lon);
			_routeMarkerArray.splice(_routeMarkerArray.length - 1);
			//removeArray(_gpxTrkseqArray, markerObject.prevPosition, markerObject.currPosition);
			_gpxTrkseqArray.splice(markerObject.currPosition, markerObject.currPosition - markerObject.currPosition)

			_polyline[_polyline.length - 1].setMap(null);
			if(_polyline.length == 1) {
				route = [];//[0] = route[1];
				_polyline = [];	//전체 삭제
				for(let i = 0; i < _routeMarkerArray.length; i++)
					_routeMarkerArray[i].marker.setMap(null);
				
				_routeMarkerArray = [];
				_gpxTrkseqArray = [];//모든 경로 삭제
				drawPlot();
				
			} else {
				_polyline.splice(_polyline.length - 1, 1);
				let temp  = _gpxTrkseqArray[_gpxTrkseqArray.length - 1];
				route[0] = new kakao.maps.LatLng(temp.lat, temp.lon);
				drawPlot();
				getWaypointInfo();
			}
			//만약 polyline object가 1개만 있으면 출발 아이콘까지 삭제???
		});
	}

	$('#waypointexcelsave').click(function(e) {
		if(_wayPointArray.length === 0) {
			alert('웨이포인트가 없습니다. 경로와 웨이포인트가 1개 이상 있어야 합니다.');
			return;
		} 
		$('#blockingAds').show();

		excelFileExport($('#gpx_metadata_name').val(),
			getWaypointToExcel(waypointSortByDistance));

		$('#blockingAds').hide();
	});


//Waypoint info
	function getWaypointInfo() {
		//서버에 요청할 웨이포인트 정보를 조립, _wayPointArray에서 필요한 정보만 사용
		let wpt = [];
		for(let i = 0; i < _wayPointArray.length; i++) {
			wpt.push({
				lat: _wayPointArray[i].position.getLat(),
				lng: _wayPointArray[i].position.getLng(),
				name: _wayPointArray[i].waypointname,
				sym: _wayPointArray[i].sym});
		}
		waypointSortByDistance = makeWaypointInfo(wpt);

		///정렬된 각각의 웨이포인트까지 거리와 소요시간을 계산해서 추가해야 한다.
		let fromPoint = _gpxTrkseqArray[0];	//시작 위치
		let distance = 0;
		let cumDistance = 0; //wpt 누적거리
		let wayIndex = 0;
		let v = Number($('#averageV').val());
		let currentTime = new Date(BASETIME);

		for(let i = 0; i < waypointSortByDistance.length; i++) {
			for(; wayIndex <= waypointSortByDistance[i].index; wayIndex++) {
				//각 wpt[0] 다음 wpt[1]까지 거리
				distance += getDistance(fromPoint, _gpxTrkseqArray[wayIndex]);
				fromPoint = _gpxTrkseqArray[wayIndex];
			}
			cumDistance += distance;	//wpt의 누적거리...

			//각 웨이포인트까지 거리...
			waypointSortByDistance[i].distance = cumDistance.toFixed(1);
			let second = distance * 3600 / v;//거리(M), 경과시간
			let time = '';

			if(second >= 3600 * 24) {	//24시간이 초과되면 닐짜를 추가해야 힌다..
				time += currentTime.getDate() + 'D';
			} else {
				currentTime.setSeconds(currentTime.getSeconds() + second);
				time += currentTime.getHours() < 10 ? '0' + currentTime.getHours() : currentTime.getHours();
				time += ':';
				time += currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes();

				//각 웨이포인트까지 예상시간...
				waypointSortByDistance[i].time = currentTime.toISOString();
				waypointSortByDistance[i].laptime = time;
			}
			//console.info('Time:' + currentTime);
			distance = 0;
		}
		let waypointinfo = getWaypointToHtml(waypointSortByDistance);
		$('#waypointinfoViewTable').html(waypointinfo);

		drawPlot();
	}

	$('#saveas').click(function(e) {
		if($('#gpx_metadata_name').val() === '') {
			alert('경로명이 없습니다.');
			return;
		}
		if(_gpxTrkseqArray.length === 0) {
			alert('경로 정보가 없습니다.');
			return;
		}

		//저장할때 포인트를 생성한다.
		getWaypointInfo();

		$('#blockingAds').show();

		_filetype = $(':radio[name="filetype"]:checked').val();

		gpxHeader();

		//파일명이 없으면 새로 만들어진 경로를 파일명으로 처
		if(_uploadFilename === '')
			_uploadFilename = $('#gpx_metadata_name').val();

		if($('#gpx_metadata_name').val() === '') {
			alert('경로명으로 파일을 저장합니다. 경로명을 입력하세요');
			return;
		}
		//파일명을 경로명으로 한다.
		gpxMetadata($('#gpx_metadata_name').val(), Number($('#averageV').val()), );

		if(_filetype === 'gpx') {
			gpxWaypoint(waypointSortByDistance);
			gpxTrack(_gpxTrkseqArray);
		} else {
			let tcxTrackPoint = makeTcxTrackPoint();
			makeTcxLap(tcxTrackPoint[0], tcxTrackPoint[tcxTrackPoint.length - 1]);
			gpxTrack(tcxTrackPoint);
			gpxWaypoint(waypointSortByDistance);
			tcxClose();
		}

		console.info(xmlData);

		saveAs(new Blob([xmlData],{
			type:"application/xml"}), $('#gpx_metadata_name').val() + '.' + _filetype);

		$('#blockingAds').hide();

	});

	function makeTcxTrackPoint() {
		let tcxTrackPoint = [];
   		let cumDistance = 0; //누적거리

		console.info('_gpxTrkseqArray length :' + _gpxTrkseqArray.length);
		let trackDistance = 0;
		let v = Number($('#averageV').val());
		let currentTime = new Date(BASETIME);

		tcxTrackPoint.push(new TrackPoint(_gpxTrkseqArray[0], currentTime.toISOString(), 0));

		//누적거리, 시간 계산
		for (let index = 0; index < _gpxTrkseqArray.length - 1; index++) {
			let fromPoint = _gpxTrkseqArray[index];
			let toPoint = _gpxTrkseqArray[index + 1];
			trackDistance = getDistance(fromPoint, toPoint) * 1000;//meter
			cumDistance += trackDistance;//누적거리 --> 누적시간 계산에 사용

			let second = trackDistance * 3.6 / v;
			currentTime.setSeconds(currentTime.getSeconds() + second);
			tcxTrackPoint.push(new TrackPoint(_gpxTrkseqArray[index + 1],
				currentTime.toISOString(), cumDistance));

			console.info(index + ' :' + trackDistance + ', ' + 	cumDistance + ', ' + currentTime.toISOString());
		}
		let diff = currentTime - new Date(BASETIME);
		console.info('diff:' + diff / 1000);

		console.info(tcxTrackPoint.toString());
		return tcxTrackPoint;
	}

});

