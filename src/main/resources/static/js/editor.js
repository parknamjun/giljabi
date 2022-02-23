var _globalMap;

var _polylineTrack = new Array();	//track path
//지도에 표시할 선을 생성합니다
var _polyline;		//polyline object

var _drawingManagerOption;
var _drawingManager;

var _uploadFilename = '';

var overlays = []; // 지도에 그려진 도형을 담을 배열

var _gpxTrkseqArray = new Array();		//gpx/trk/trkseq

function getGpxTrk(lat, lon, ele) {
	var trkpt = new Object();
	trkpt.lat = lat;
	trkpt.lon = lon;
	trkpt.ele = ele;
	return trkpt;
}

var eleFalg = false;	//고도정보를 받아온 경우 true
$(document).ready(function() {
	var options = {
		center: getLocation(), //Seoul city hall
		level: 8
	};
	_globalMap = new daum.maps.Map(document.getElementById('map'), options);
	
	var mapTypeControl = new daum.maps.MapTypeControl(); // 지도타입 컨트롤
	_globalMap.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
	
	// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
	var zoomControl = new daum.maps.ZoomControl();
	_globalMap.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
	
	// 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
	//daum.maps.event.addListener(_globalMap, 'click', function (mouseEvent) {
	//	console.log('지도에서 클릭한 위치의 좌표는 ' + mouseEvent.latLng.toString() + ' 입니다.');
	//});	
	
	
	_drawingManagerOption = { // Drawing Manager를 생성할 때 사용할 옵션입니다
		map: _globalMap, // Drawing Manager로 그리기 요소를 그릴 map 객체입니다
		drawingMode: [ // drawing manager로 제공할 그리기 요소 모드입니다
		    daum.maps.drawing.OverlayType.MARKER,
		    daum.maps.drawing.OverlayType.POLYLINE
		],
		// 사용자에게 제공할 그리기 가이드 툴팁입니다
		// 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
		guideTooltip: ['draw', 'drag', 'edit'], 
		markerOptions: { // 마커 옵션입니다 
		    draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다 
		    removable: true // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다  
		},
		polylineOptions: { // 선 옵션입니다
		    draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
		    removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
		    editable: true, // 그린 후 수정할 수 있도록 설정합니다 
		    strokeColor: '#ff0000', // 선 색
		    hintStrokeStyle: 'dash', // 그리중 마우스를 따라다니는 보조선의 선 스타일
		    hintStrokeOpacity: 0.5  // 그리중 마우스를 따라다니는 보조선의 투명도
		}
	};
	adsview('editor_init');
	//위에 작성한 옵션으로 Drawing Manager를 생성합니다
	_drawingManager = new daum.maps.drawing.DrawingManager(_drawingManagerOption);

	daum.maps.event.addListener(_globalMap, 'dragend', function() {
		console.log(_certiFlag);
		removePoi(_markerList);
		var bounds = _globalMap.getBounds();
		getPoi(_globalMap, bounds, _globalMap.getLevel());
	});
	
	// 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
	daum.maps.event.addListener(_globalMap, 'zoom_changed', function() {        
	    // 지도의 현재 레벨을 얻어옵니다
	    var level = _globalMap.getLevel();   
	    console.log('현재 지도 레벨은 ' + level + '입니다');

	    var bounds = _globalMap.getBounds();
		getPoi(_globalMap, bounds, _globalMap.getLevel());
	});

	$(".mapType").change(function(){
	    for (var type in _mapTypes) {
	    	_globalMap.removeOverlayMapTypeId(_mapTypes[type]);    
	    }

	    if($("#chkTerrain").is(":checked")){
	    	_globalMap.addOverlayMapTypeId(_mapTypes.terrain);    
        }
        if($("#chkBicycle").is(":checked")){
        	_globalMap.addOverlayMapTypeId(_mapTypes.bicycle);    
        }

        //인증센터 POI
        _certiFlag = $("#chkCertification").is(":checked") ? true : false;
        //지도레벨이 5~1에서만 보여준다.
        _cvsFlag = $("#chkCvs").is(":checked") ? true : false;
    });
	
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
		var minAlti = 0, maxAlti = 0; curAlti = 0;
		var currentLat, currentLon, nextLat, nextLon;
		for(var i = 0; i < _gpxTrkseqArray.length; i++) {
			curAlti = Number(_gpxTrkseqArray[i].ele);	//고도

			if(flag == true) { //다음값을 비교하기 위한 플래그
				minAlti = curAlti;
				maxAlti = curAlti;

				currentLat = _gpxTrkseqArray[i].lat;
				currentLon = _gpxTrkseqArray[i].lon;
				nextLat = _gpxTrkseqArray[i].lat;
				nextLon = _gpxTrkseqArray[i].lon;
			} else {
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
				cursorMarker.setMap(_globalMap);
				
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
	
	$('#getElevation').click(function() {
		//$('#editinfo').block({ message: '<h4>Processing</h1>', 
        //    css: { border: '3px solid #a00', width:'600px' }
		//}); 

		$('#blockingAds').show();
		//모든 polyline
		var trkseq = new Array();	//servlet에 요청하기 위한 배열 object를 string으로 변환 
		var data = _drawingManager.getData();
		var len = data[daum.maps.drawing.OverlayType.POLYLINE].length;
		for(var i = 0; i < len; i++) {
			var line = pointsToPath(data.polyline[i].points);
			for( var j = 0; j < line.length; j++) {
				trkseq.push( {lat:line[j].getLat(), lng:line[j].getLng()} );
			}
		}
		
		//console.log(JSON.stringify(trkseq));
		$.ajax({
			type: 'post',
			url : '/elevation.do', 
			data: { trackPoint : JSON.stringify(trkseq) },
			dataType:'json',
			async : true,
			complete: function() {
				
			},
			success:function(data, status) {
				if(data.resultcode == 'success') {
					_gpxTrkseqArray = [];
					eleFalg = true;
					var jsonList = JSON.parse(data.resultlist);
					$.each(jsonList, function() {
						var trkpt = getGpxTrk($(this).attr('lat'), $(this).attr('lng'), $(this).attr('ele'));
						_gpxTrkseqArray.push(trkpt);
					});
					$('#check').text(data.check);
					drawPlot();
				} else {
					eleFalg = false;
					alert(data.resultmessage);
				}
				//$('#editinfo').unblock(); 
				$('#blockingAds').hide();
			}
		});
		
	});
	
	$('#tcxsave').click(function(){
		if(!confirm('tcx파일로 저장할까요?')) {
			return;
		}
		if(_gpxTrkseqArray.length == 0) {
			alert('고도 정보가 있어야 저장할 수 있습니다.');
			return;
		}
		var trkseq = new Array();	//servlet에 요청하기 위한 배열 object를 string으로 변환 
		$.each(_gpxTrkseqArray, function() {
			trkseq.push( {lat:$(this).attr('lat'), lng:$(this).attr('lon')
				, ele:$(this).attr('ele')});
		});

		var fn = _uf == undefined ? (new Date().getTime() / 1000).toFixed(0) : _uf
		$.ajax({
			type: 'post',
			url : '/gpx2tcx.do', 
			data: {     trkseq   : JSON.stringify(trkseq)
				, wpt : ''
				, velocity : $('#averageV').val()
				, courseName : fn
				, fileName : fn
				, filetype : 'tcx'	//tcx만 사용함
				, command : 'editor'
			},
			dataType:'json',
			async : false,
			timeout : 10000,
			complete: function() {
				
			},
			success:function(data, status) {
				if(data.resultcode == 'success') {
					_gpxTrkseqArray = [];
					result = true;
					//console.log(data.tcxdata);
					var blob=new Blob([data.tcxdata]);
					var link=document.createElement('a');
					link.href=window.URL.createObjectURL(blob);
					if(fn.indexOf('giljabi_ele') >= 0)
						link.download= fn + '.tcx';
					else
						link.download= fn + '_giljabi_ele' + '.tcx';
					link.click();
				} else {
					alert(data.resultmessage);
				}
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
		});
	});

	$('#reset').click(function(){
		if(confirm('초기화 할까요?'))
			location.reload();
	});	
});


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
function makeObject(xml) {
	var x;	//업로드된 파일의 데이터
	x = $.parseXML(xml);
	x = $(x);
	
	if(_ft.toLowerCase() == 'gpx') {
		loadGpx(x);
	} else if(_ft.toLowerCase() == 'tcx') {
		loadTcx(x);
	}

	//시작과 끝 표시
	makeMarkerPoint(_globalMap, 'start', _gpxTrkseqArray[0]);
	makeMarkerPoint(_globalMap, 'end', _gpxTrkseqArray[_gpxTrkseqArray.length - 1]);
	
	//drawPolyline(_trkPoly); //경로를 그린다.
    var style = _drawingManagerOption.polylineOptions;
    var polyline = new daum.maps.Polyline({
        map: _globalMap,
        path: _trkPoly,
        strokeColor: style.strokeColor,
        strokeOpacity: style.strokeOpacity,
        strokeStyle: style.strokeStyle,
        strokeWeight: style.strokeWeight
    });
	_drawingManager.put(daum.maps.drawing.OverlayType.POLYLINE, _trkPoly);
	
	var trkpt = _gpxTrkseqArray[parseInt(_gpxTrkseqArray.length / 2)];
	_globalMap.setCenter(new daum.maps.LatLng(trkpt.lat, trkpt.lon)); //중심점을 경로상의 중간을 설정한다.
	_globalMap.setLevel(10);
}

function loadGpx(x) {
	$.each(x.find('gpx').find('trk').find('trkseg').find('trkpt'), function() {
		var trkpt = getGpxTrk($(this).attr('lat'), $(this).attr('lon'), $(this).find('ele').text());
		_gpxTrkseqArray.push(trkpt);
		_trkPoly.push(new daum.maps.LatLng($(this).attr('lat'), $(this).attr('lon')));
	});
}
function loadTcx(x) {
	$.each(x.find('Trackpoint'), function() {
		var trkpt = new Object();
		trkpt.lat = $(this).find('LatitudeDegrees').text();
		trkpt.lon = $(this).find('LongitudeDegrees').text();
		trkpt.ele = $(this).find('AltitudeMeters').text();
		
		_gpxTrkseqArray.push(trkpt);
		_trkPoly.push(new daum.maps.LatLng(trkpt.lat, trkpt.lon));
	});
}

function getDataFromDrawingMap() {
    // Drawing Manager에서 그려진 데이터 정보를 가져옵니다 
    var data = _drawingManager.getData();

    // 아래 지도에 그려진 도형이 있다면 모두 지웁니다
    removeOverlays();

    // 지도에 가져온 데이터로 도형들을 그립니다
    drawPolyline(data[daum.maps.drawing.OverlayType.POLYLINE]);
}

function drawPolyline(lines) {
    var len = lines.length, i = 0;
    var path = new Array();
    for (; i < len; i++) {
        path = pointsToPath(lines[i].points);
    }
  
 // 그리기 관리자에 polyline을 추가한다
	_drawingManager.put(daum.maps.drawing.OverlayType.POLYLINE, path);
}

function removeOverlays() {
    var len = overlays.length, i = 0;

    for (; i < len; i++) {
        overlays[i].setMap(null);
    }

    overlays = [];
}
//Drawing Manager에서 가져온 데이터 중 
function pointsToPath(points) {
    var len = points.length, path = [], i = 0;
 
	for (; i < len; i++) { 
	    var latlng = new daum.maps.LatLng(points[i].y, points[i].x);
	    path.push(latlng); 
	    console.log(latlng);
	}
	
	return path;
}

//버튼 클릭 시 호출되는 핸들러 입니다
function selectOverlay(type) {
	// 그리기 중이면 그리기를 취소합니다
	_drawingManager.cancel();

	// 클릭한 그리기 요소 타입을 선택합니다
	_drawingManager.select(daum.maps.drawing.OverlayType[type]);
}



