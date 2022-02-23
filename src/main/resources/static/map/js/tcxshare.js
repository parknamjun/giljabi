/**
 * 2018.10.26 gpx to tcx Project start....
 * Author : park namjun, eahn.park@gmail.com
 */

var _mapTypes = {
    terrain : daum.maps.MapTypeId.TERRAIN,
    bicycle : daum.maps.MapTypeId.BICYCLE
};
var _newPosition;

var _map;

//https://www.topografix.com/GPX/1/1
var _gpx = new Object();				//gpx
var _gpxMetadata = new Object();		//gpx/metadata
var _gpxWptArray = new Array();			//허수, gpx/wpt, gpx웨이포인트
var _gpxTrkArray = new Array();			//허수, gpx/trk
var _gpxTrkseqArray = new Array();		//gpx/trk/trkseq

var _tcx = new Object();				//gpx
var _tcxMetadata = new Object();		//tcx Folder
var _tcxCourses = new Object();			//tcx Courses(Name, Lap)
var _tcxWptArray = new Array();			//tcx CoursePoint
var _tcxTrkseqArray = new Array();		//tcx Track/Trackpoint

var _gpxname;
$(document).ready(function() {
	//지도초기화
	var container = document.getElementById('map');
	var options = {
		center: getUserLocation(),	//사용자 위치 또는 서울시청
		level: 8
	};
	
	_map = new daum.maps.Map(container, options);

	// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
	var mapTypeControl = new daum.maps.MapTypeControl();
	_map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
	
	$(".mapType").change(function(){
	    for (var type in _mapTypes) {
	    	_map.removeOverlayMapTypeId(_mapTypes[type]);    
	    }

	    if($("#chkTerrain").is(":checked")){
	    	_map.addOverlayMapTypeId(_mapTypes.terrain);    
        }
        if($("#chkBicycle").is(":checked")){
        	_map.addOverlayMapTypeId(_mapTypes.bicycle);    
        }
    });

	onLoad();

	//만약, 웨이포인트가 start, end와 동일한 위치인 경우는 웨이포인트를 그리지 않는다.
	function addWaypoint(info) {
		//waypoint(info.position, info.name, info.sym);
	    var waypointIcon = info.sym;	//default
	    var waypointName = info.name;	//default
	    var content = document.createElement('div');
		content.innerHTML = '<img src=\"/images/'+ waypointIcon.toLowerCase() +'.png\" class=\"pointImage\"><span class=\"pointText\">' + waypointName + '</span>';
		 // 커스텀 오버레이를 생성합니다 
	    var customoverlay = new daum.maps.CustomOverlay({
	        map: _map,
	        clickable: false,
	        content: content,
	        position : info.position
		});
	}
	


	 //현재 위치 정보 알아보는 메소드
	 function getUserLocation(){
		 return new daum.maps.LatLng(37.56683546665817, 126.9786607449023);	//서울시청
	 }


	//=======================================================================
	//gpx file loading....
	$('#fileInput').change(function() { 
		if(_fl) {
			alert('이미 기본 파일이 열려 있습니다.');
			return;
		} else {
			var file = document.getElementById('fileInput').files[0];
			_uf = file.name.substring(0, file.name.lastIndexOf('.'));
			_ft = file.name.substring(file.name.lastIndexOf('.') + 1);
			_fl = true;
			var reader = new FileReader();
	
			reader.onload = function(e) {
				makeObject(reader.result);
				//console.log(reader.result);	//필요하면 디버깅으로...
			};
	
			reader.readAsText(file);
			$('#gpx_metadata_name').val(_uf);	
		}
	});

	//javascript를 사용하면 서버의 부하를 줄일수 있고, 필요한 정보만 servlet에 요청 후 받아오게 한다.
	function makeObject(xml) {
		var x;	//업로드된 파일의 데이터
		x = $.parseXML(xml);
		x = $(x);
		
		if(_ft == 'gpx') {	//사용하지 않음
			_gpx = x.find('gpx');
			//정상적인 포맷에서 필요한 정보들...
			//_metadata = x.find('metadata');	//gpx:metadata, tcx:Folders
			_gpxMetadata.author = x.find('gpx').find('metadata').find('author').text();
			//$('#gpx_metadata_author').val(gpxMetadata.author);
	
			_gpxMetadata.name = x.find('gpx').find('metadata').find('name').text();
			//$('#gpx_metadata_name').val(_gpxMetadata.name);
	
			_gpxMetadata.desc = x.find('gpx').find('metadata').find('desc').text();
			//$('#gpx_metadata_desc').val(gpxMetadata.desc);
	

			loadGpx(x);
			
			//track 정보, 고도차트에서 마우스가 위치한 지점의 마커정보를 보여주기 위함
		} else if(_ft == 'tcx') {
			//_tcx = _xmlData.find('TrainingCenterDatabase');
			//_metadata = _xmlData.find('TrainingCenterDatabase').find('Folders');	//입력한 내용을 수정없이 저장함
			//_tcxCourses = _xmlData.find('TrainingCenterDatabase').find('Courses');

			loadTcx(x);

		}

		//시작과 끝 표시
		makeMarkerPoint(_map, 'start', _gpxTrkseqArray[0]);
		makeMarkerPoint(_map, 'end', _gpxTrkseqArray[_gpxTrkseqArray.length - 1]);
		
		drawPolyline(_trkPoly); //경로를 그린다.

		var trkpt = _gpxTrkseqArray[parseInt(_gpxTrkseqArray.length / 2)];
		_map.setCenter(new daum.maps.LatLng(trkpt.lat, trkpt.lon)); //중심점을 경로상의 중간을 설정한다.
		_map.setLevel(10);
		drawPlot();
	}

	function getGpxWpt(lat, lon, ele, name, desc, type, sym) {
		var wptitem = new Object();
		wptitem.uid = _u++;
		wptitem.position = new daum.maps.LatLng(lat, lon);
		wptitem.ele = ele;
		wptitem.name = name;		//웨이포인트 이름
		wptitem.desc = desc;		//웨이포인트 설명
		wptitem.type = type;		//sym 설명
		wptitem.sym = sym;
		return wptitem;
	}
	
	function getGpxTrk(lat, lon, ele) {
		var trkpt = new Object();
		trkpt.lat = lat;
		trkpt.lon = lon;
		trkpt.ele = ele;
		return trkpt;
	}
	
	function getIconString(sym) {
		var s = 'danger,flag,food,generic,left,right,sprint,summit,water,waypoint';
		if(s.indexOf(sym) >= 0)
			return sym;
		else
			return 'flag';
	}
	
	function loadGpx(x) {
		//gpx파일에 wpt waypoint가 있는경우 
		$.each(x.find('gpx').find('wpt'), function() {		
			var wptitem = getGpxWpt(
					  $(this).attr('lat'), $(this).attr('lon')
					, $(this).find('ele').text(), $(this).find('name').text()
					, $(this).find('desc').text(), $(this).find('type').text()
					, getIconString($(this).find('sym').text()));
			//_gpxWptArray.push(wptitem);

			//gpx파일 로딩시 waypoint가 있으면 그려준다.
			addWaypoint(wptitem);
		});
		var h = new Number(0);
		var d = new Number(0);
		
		//경로
		var index = 0;
		var baseHeigth = 0;
		$.each(x.find('gpx').find('trk').find('trkseg').find('trkpt'), function() {
			var trkpt = getGpxTrk($(this).attr('lat'), $(this).attr('lon'), $(this).find('ele').text());
			_gpxTrkseqArray.push(trkpt);
			_trkPoly.push(new daum.maps.LatLng($(this).attr('lat'), $(this).attr('lon')));
			
			//획득고도를 계산
			if(index > 0) {
				var ele = _gpxTrkseqArray[index].ele - _gpxTrkseqArray[index - 1].ele;
				if(ele >= 0) 
					h += ele;
				else
					h -= ele;
				//console.log('up:' + h + ', down:' + d);
			} else {
				baseHeigth = _gpxTrkseqArray[0].ele;
			}
			index++;
		});
		//$('#AcquisitionElevation').val(h.toFixed(0));
	}
	
	function loadTcx(x) {
		//gpx파일에 wpt waypoint가 있는경우 
		$.each(x.find('CoursePoint'), function() {		
			var wptitem = new Object();
			wptitem.uid = _u++;
			wptitem.position = new daum.maps.LatLng($(this).find('LatitudeDegrees').text()
					, $(this).find('LongitudeDegrees').text());
			wptitem.ele = '';
			wptitem.name = $(this).find('Name').text();		//웨이포인트 이름
			wptitem.desc = '';		//웨이포인트 설명
			wptitem.type = '';		//sym 설명
			wptitem.sym = $(this).find('PointType').text();
			//_gpxWptArray.push(wptitem);

			//gpx파일 로딩시 waypoint가 있으면 그려준다.
			addWaypoint(wptitem);
		});
		
		//경로
		$.each(x.find('Trackpoint'), function() {
			var trkpt = new Object();
			trkpt.lat = $(this).find('LatitudeDegrees').text();
			trkpt.lon = $(this).find('LongitudeDegrees').text();
			trkpt.ele = $(this).find('AltitudeMeters').text();
			
			_gpxTrkseqArray.push(trkpt);
			
			_trkPoly.push(new daum.maps.LatLng(trkpt.lat, trkpt.lon));

		});
	
	}
	
	function drawPlot() {
		//웨이포인트 테스트용도...
		var legends = $("#elevationImage .legendLabel");
		var updateLegendTimeout = null;
		var latestPosition = null;
		var cursorMarker = new daum.maps.Marker();

		var eleArray = Array();		//경로의 높이정보
		var distance = 0;			//직전이동거리
		var odometer = Number(0);	//누적이동거리
		var flag = true;			//다음값을 사용할것인지 결정
		var currentTime = new Date(), nextTime = new Date();
		var spentTime = 0;
		var minAlti = 0, maxAlti = 0; curAlti = 0;
		var currentLat, currentLon, nextLat, nextLon;
		for(var i = 0; i < _gpxTrkseqArray.length; i++) {
			curAlti = Number(_gpxTrkseqArray[i].ele);	//고도

			if(flag == true) { //다음값을 비교하기 위한 플래그
				currentTime = new Date('2018-01-01T00:00:00Z');
				nextTime = new Date('2018-01-01T00:00:00Z');
				minAlti = curAlti;
				maxAlti = curAlti;

				currentLat = _gpxTrkseqArray[i].lat;
				currentLon = _gpxTrkseqArray[i].lon;
				nextLat = _gpxTrkseqArray[i].lat;
				nextLon = _gpxTrkseqArray[i].lon;
			} else {
				nextTime = appendTime(spentTime);
				nextLat = _gpxTrkseqArray[i].lat;
				nextLon = _gpxTrkseqArray[i].lon;
			}
			
			if(curAlti >= maxAlti) maxAlti = curAlti; //전체 경로에서 최대높이
			if(curAlti <= minAlti) minAlti = curAlti; //전체 경로에서 최저높이
			
			distance = getDistanceFromLatLon(currentLat, currentLon, nextLat, nextLon);
			odometer += Number(distance);
			
			spentTime = distance / 3.6;
			
			//누적거리와 고도정보
			eleArray.push([odometer/1000, Number(_gpxTrkseqArray[i].ele)]);
			if(flag == false) {
				currentTime = nextTime;
				currentLat = nextLat;
				currentLon = nextLon;
			}
			flag = false;
		}

		//참고 http://www.flotcharts.org/flot/examples/tracking/index.html
		plot = $.plot("#elevationImage", [{ data: eleArray}]
		, {
			//series: { lines: { show: true }},
			crosshair: { mode: "x"},
			grid: {	hoverable: true, autoHighlight: false, show:true, aboveData : true },
			yaxis: { min: minAlti * 0.7, max: maxAlti * 1.2} //위/아래에 약간의 여유
		});

	
		function updateLegend() {
			updateLegendTimeout = null;
			var pos = latestPosition;
			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {
				var series = dataset[i];
				for (j = 0; j < series.data.length; ++j) {
					if (series.data[j][0] > pos.x) {
						break;
					}
				}

				//고도차트에서 마무스를 따라 움직이는 지도상의 마커
				cursorMarker.setMap(null);	//마커를 삭제하고
				cursorMarker = new daum.maps.Marker({
					position: new daum.maps.LatLng(_gpxTrkseqArray[j].lat, _gpxTrkseqArray[j].lon)
				});
				cursorMarker.setMap(_map);
				
				//경사도를 구해보자...앞2개 뒤2개 평균을 이용해보자...
				var distance = getDistanceFromLatLon(
						_gpxTrkseqArray[j].lat, _gpxTrkseqArray[j].lon
					, _gpxTrkseqArray[j - 1].lat, _gpxTrkseqArray[j - 1].lon);
				//_gpxTrkseqArray[j - 1].getAttribute('lat'), _gpxTrkseqArray[j - 1].getAttribute('lon'));
				//var hcurAlti = Number($_gpxTrkseqArray[j].find('ele').text());	//고도
				var delTaHeight = Number(_gpxTrkseqArray[j].ele) - Number(_gpxTrkseqArray[j - 1].ele);

				//- Number(_gpxTrkseqArray[j - 1].find('ele').text());
				var slope = delTaHeight * 100 / distance;
				$('#slope').val(slope.toFixed(2) + '%');
			}
		}

		//차트에서 마우스의 움직임이 있으면....
		$("#elevationImage").bind("plothover",  function (event, pos, item) {
			latestPosition = pos;
			if (!updateLegendTimeout) {
				updateLegendTimeout = setTimeout(updateLegend, 50);
			}
		});

	}

	//https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
	//http://developer.garmin.com/downloads/connect-api/sample_file.tcx
	$('#filedownload').click(function(){
		window.location.href='/download?fileId=' + getParam('fileid', window.location.href);
		return false;
	});

	
	function onLoad() {
		var fileid = getParam('fileid', window.location.href)
		$.ajax({
			type: 'post',
			url : '/tcxshare.do', 
			data: { fileId : getParam('fileid', window.location.href)},
			dataType:'json',
			async : false,
			complete: function() {
				
			},
			success:function(data, status) {
				if(data.resultcode == 'success') {
					_ft = 'tcx';
					$('#gpxname').val(data.gpxname);
					makeObject(data.tcxdata);
				} else {
					alert(data.resultMessage);
				}
			}
		});
	}
	
	function drawPolyline(polyline) {
		var p;
 	 	// 지도에 표시할 선을 생성합니다
		p = new daum.maps.Polyline({
		    path: polyline, // 선을 구성하는 좌표배열 입니다
		    strokeWeight: 5, // 선의 두께 입니다
		    strokeColor: '#FF0000', // 선의 색깔입니다
		    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
		    strokeStyle: 'solid' // 선의 스타일입니다
		});
		// 지도에 선을 표시합니다 
		p.setMap(_map);
	}
});
