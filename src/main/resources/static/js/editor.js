let _globalMap;
let _fileOpen = false;
let _fileName = '';
let _drawingManagerOption;
let _drawingManager;
let overlays = []; // 지도에 그려진 도형을 담을 배열
let _gpxTrkseqArray = new Array();		//gpx/trk/trkseq

// 배경으로 사용할 GPX 파일을 로드한다.
let baseTrkList = [];
let baseWptList = [];
let basePolyline = [];
let _filetype = 'gpx';

let BASETIME = new Date('2022-01-01T00:00:00Z');

function getGpxTrk(lat, lon, ele) {
    let trkpt = new Object();
    trkpt.lat = lat;
    //trkpt.lon = lon; //20240319 lng로 변경
    trkpt.lng = lon;
    trkpt.ele = ele;
    return trkpt;
}

let eleFalg = false;	//고도정보를 받아온 경우 true
$(document).ready(function () {
    let options = {
        center: getLocation(), //Seoul city hall
        level: 8
    };
    _globalMap = new kakao.maps.Map(document.getElementById('map'), options);

    let mapTypeControl = new kakao.maps.MapTypeControl(); // 지도타입 컨트롤
    _globalMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    let zoomControl = new kakao.maps.ZoomControl();
    _globalMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    _drawingManagerOption = { // Drawing Manager를 생성할 때 사용할 옵션입니다
        map: _globalMap, // Drawing Manager로 그리기 요소를 그릴 map 객체입니다
        drawingMode: [ // drawing manager로 제공할 그리기 요소 모드입니다
            kakao.maps.drawing.OverlayType.MARKER,
            kakao.maps.drawing.OverlayType.POLYLINE
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
            hintStrokeOpacity: 0.5,  // 그리중 마우스를 따라다니는 보조선의 투명도
            strokeWeight: 3

        }
    };

    //위에 작성한 옵션으로 Drawing Manager를 생성합니다
    _drawingManager = new kakao.maps.drawing.DrawingManager(_drawingManagerOption);

    kakao.maps.event.addListener(_globalMap, 'dragend', function () {
        removePoi(_markerList);
        var bounds = _globalMap.getBounds();
        //getPoi(_globalMap, bounds, _globalMap.getLevel());
    });

    // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(_globalMap, 'zoom_changed', function () {
        // 지도의 현재 레벨을 얻어옵니다
        var level = _globalMap.getLevel();
        //console.log('현재 지도 레벨은 ' + level + '입니다');

        //var bounds = _globalMap.getBounds();
        //getPoi(_globalMap, bounds, _globalMap.getLevel());
    });

    $(".mapType").change(function () {
        for (var type in _mapTypes) {
            _globalMap.removeOverlayMapTypeId(_mapTypes[type]);
        }

        if ($("#chkTerrain").is(":checked")) {
            _globalMap.addOverlayMapTypeId(_mapTypes.terrain);
        }
        if ($("#chkBicycle").is(":checked")) {
            _globalMap.addOverlayMapTypeId(_mapTypes.bicycle);
        }

        //인증센터 POI
        _certiFlag = $("#chkCertification").is(":checked") ? true : false;
        //지도레벨이 5~1에서만 보여준다.
        _cvsFlag = $("#chkCvs").is(":checked") ? true : false;
    });

    //gpx file loading....
    $('#fileInput').change(function () {
        if (_fileOpen) {
            alert('이미 기본 파일이 열려 있습니다.');
            return;
        } else {
            let file = document.getElementById('fileInput').files[0];
            _fileName = file.name.substring(0, file.name.lastIndexOf('.'));
            _fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
            _fileOpen = true;
            var reader = new FileReader();

            reader.onload = function (e) {
                makeObject(reader.result);
                //console.log(reader.result);	//필요하면 디버깅으로...
            };

            reader.readAsText(file);
            $('#gpx_metadata_name').val(_fileName);
        }
    });

    //
    $('#baseInput').change(function () {
        let file = document.getElementById('baseInput').files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            basePathLoadGpx(reader.result, '#A52A2A');
        };

        reader.readAsText(file);
    });

    $('#moutain').click(function () {
        let mountainList = [];
        $.ajax({
            type: 'get',
            url: '/api/1.0/mountain',
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            complete: function () {
            },
            success: function (response, status) {
                if (response.status === 0) {
                    mountainList = response.data;
                } else {
                    alert(response.message);
                }
            },
        });
        console.log(mountainList);
        $.each(mountainList, function (index, ele) {
            $.ajax({
                type: 'get',
                url: '/api/1.0/mountain/' + mountainList[index],
                contentType: 'application/json',
                dataType: 'json',
                async: false,
                complete: function () {
                },
                success: function (response, status) {
                    if (response.status === 0) {
                        basePathLoadGpx(response.data, '#0037ff');
                    } else {
                        alert(response.message);
                    }
                },
            });
        });
    });

    function combo100() {
        $.ajax({
            type: 'get',
            url: '/api/1.0/mountain100',
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            complete: function () {
            },
            success: function (response, status) {
                if (response.status === 0) {
                    response.data.forEach(function (mountain) {
                        $('#mountain100Select').append($('<option></option>').val(mountain).html(mountain));
                    });
                    console.info($('#mountain100Select').html());
                } else {
                    alert(response.message);
                }
            },
        });
    }

    $('#mountain100Select').on('change', function () {
        // this를 사용하여 현재 선택된 옵션의 value를 얻음
        let selectedValue = $(this).val();

        let mountainList = [];
        $.ajax({
            type: 'get',
            url: '/api/1.0/mountain100/' + selectedValue,
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            complete: function () {
            },
            success: function (response, status) {
                if (response.status === 0) {
                    mountainList = response.data;
                } else {
                    alert(response.message);
                }
            },
        });
        console.log(mountainList);

        $.each(mountainList, function (index, ele) {
            $.ajax({
                type: 'get',
                url: '/api/1.0/mountain100Gpx/' + mountainList[index],
                contentType: 'application/json',
                dataType: 'json',
                async: true,
                complete: function () {
                },
                success: function (response, status) {
                    if (response.status === 0) {
                        basePathLoadGpx(response.data, '#0037ff');
                    } else {
                        alert(response.message);
                    }
                },
            });
        });
    });

    combo100();

    function drawPlot() {
        if (_gpxTrkseqArray.length == 0) {
            alert('고도 정보가 없습니다.');
            return;
        }

        var legends = $("#elevationImage .legendLabel");
        var updateLegendTimeout = null;
        var latestPosition = null;
        var cursorMarker = new kakao.maps.Marker();

        let eleArray = [];		//경로의 높이정보
        var distance = 0;			//직전이동거리
        var odometer = Number(0);	//누적이동거리
        var minAlti = 0, maxAlti = 0;
        let curAlti = 0;
        for (let i = 1; i < _gpxTrkseqArray.length; i++) {
            distance = getDistance(_gpxTrkseqArray[i - 1], _gpxTrkseqArray[i]);
            odometer += distance;

            curAlti = _gpxTrkseqArray[i - 1].ele;	//고도

            if (curAlti >= maxAlti) maxAlti = curAlti; //전체 경로에서 최대높이
            if (curAlti <= minAlti) minAlti = curAlti; //전체 경로에서 최저높이

            //누적거리와 고도정보
            eleArray.push([odometer, _gpxTrkseqArray[i - 1].ele]);
        }
        eleArray.push([odometer, _gpxTrkseqArray[_gpxTrkseqArray.length - 1].ele]);

        //참고 http://www.flotcharts.org/flot/examples/tracking/index.html
        plot = $.plot("#elevationImage", [{data: eleArray}]
            , {
                //series: { lines: { show: true }},
                crosshair: {mode: "x"},
                grid: {hoverable: true, autoHighlight: false, show: true, aboveData: true},
                yaxis: {min: minAlti * 0.7, max: maxAlti * 1.2} //위/아래에 약간의 여유
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

                let position;
                //고도차트에서 마무스를 따라 움직이는 지도상의 마커
                cursorMarker.setMap(null);	//마커를 삭제하고
                if (j == series.data.length) {
                    position = new kakao.maps.LatLng(_gpxTrkseqArray[_gpxTrkseqArray.length - 1].lat,
                        _gpxTrkseqArray[_gpxTrkseqArray.length - 1].lng);
                } else {
                    position = new kakao.maps.LatLng(_gpxTrkseqArray[j].lat, _gpxTrkseqArray[j].lng);
                }
                cursorMarker = new kakao.maps.Marker({
                    position: position
                });
                cursorMarker.setMap(_globalMap);
            }
        }

        //차트에서 마우스의 움직임이 있으면....
        $("#elevationImage").bind("plothover", function (event, pos, item) {
            latestPosition = pos;
            if (!updateLegendTimeout) {
                updateLegendTimeout = setTimeout(updateLegend, 50);
            }
        });

    }


    $('#getElevation').click(function () {
        /*        $('#editinfo').block({
                    message: '<h4>Processing</h1>',
                    css: {border: '3px solid #a00', width: '600px'}
                });*/

        $('#blockingAds').show();

        //모든 polyline
        let trkseq = new Array();	//servlet에 요청하기 위한 배열 object를 string으로 변환
        let data = _drawingManager.getData();
        let len = data[kakao.maps.drawing.OverlayType.POLYLINE].length;
        for (let i = 0; i < len; i++) {
            let line = pointsToPath(data.polyline[i].points);
            for (let j = 0; j < line.length; j++) {
                trkseq.push({lat: line[j].getLat(), lng: line[j].getLng()});
            }
        }

        $.ajax({
            type: 'post',
            url: '/api/1.0/elevation',
            data: JSON.stringify({trackPoint: trkseq}),
            contentType: 'application/json',
            dataType: 'json',
            async: true,
            complete: function () {

            },
            success: function (response, status) {
                if (response.status === 0) {
                    _gpxTrkseqArray = [];
                    _gpxTrkseqArray = response.data;
                    eleFalg = true;
                    //$('#check').text(data.check);
                    drawPlot();
                } else {
                    eleFalg = false;
                    alert(response.message);
                }
                $('#blockingAds').hide();
            },
        });
    });

    $('#gpxsave').click(function () {
        if(_gpxTrkseqArray.length == 0) {
            if(!confirm("고도(높이) 정보를 처리하지 않고 경로를 저장할까요?")) {
                return;
            }
            //구글 높이를 받아오지 않은 경우에도 경로를 저장하기 위한 정보처리
            let data = _drawingManager.getData();
            let len = data[kakao.maps.drawing.OverlayType.POLYLINE].length;
            for (let i = 0; i < len; i++) {
                let line = pointsToPath(data.polyline[i].points);
                for (let j = 0; j < line.length; j++) {
                    _gpxTrkseqArray.push({lat: line[j].getLat(), lng: line[j].getLng(), ele: 0, dist:0, ele:0, time:''});
                }
            }
        }

        _fileName = (new Date().getTime() / 1000).toFixed(0);

        let ptDateTime = new Date(BASETIME);

        _gpxTrkseqArray[0].time = (new Date(BASETIME)).toISOString();
        _gpxTrkseqArray[0].dist = 0;

        //시간 = 거리 / 속도
        let speed = Number($('#averageV').val());
        for (let trkptIndex = 1; trkptIndex < _gpxTrkseqArray.length; trkptIndex++) {
            let distance = getDistance(_gpxTrkseqArray[trkptIndex - 1], _gpxTrkseqArray[trkptIndex]);
            _gpxTrkseqArray[trkptIndex].dist = (Number(_gpxTrkseqArray[trkptIndex - 1].dist) + distance).toFixed(2);
            let ptSecond = distance / speed * 3600;
            ptDateTime.setSeconds(ptDateTime.getSeconds() + ptSecond);
            _gpxTrkseqArray[trkptIndex].time = ptDateTime.toISOString();
            _gpxTrkseqArray[trkptIndex].desc = _gpxTrkseqArray[trkptIndex].dist; //누적거리 km

        }

        gpxHeader();
        gpxMetadata(_fileName, Number($('#averageV').val()), (new Date(BASETIME)).toISOString());
        gpxTrack(_gpxTrkseqArray);

        saveAs(new Blob([xmlData], {
            type: "application/vnd.garmin.gpx+xml"
        }), _fileName + '.' + _filetype);
    });

    $('#reset').click(function () {
        if (confirm('초기화 할까요?'))
            location.reload();
    });
    /*
    $('#wptIcon').click(function () {
        if ($(this).prop('checked')) {
            //웨이포인트를 삭제하자...
            console.log('Checkbox is checked.');
            baseWptList.forEach(function (item) {
                item.setMap(null);
            });
        } else {
            console.log('Checkbox is unchecked.');
        }
    });
*/
});


//https://www.topografix.com/GPX/1/1
/*var _gpx = new Object();				//gpx
var _gpxMetadata = new Object();		//gpx/metadata
var _gpxWptArray = new Array();			//허수, gpx/wpt, gpx웨이포인트
var _gpxTrkArray = new Array();			//허수, gpx/trk
//var _gpxTrkseqArray = new Array();		//gpx/trk/trkseq

var _tcx = new Object();				//gpx
var _tcxMetadata = new Object();		//tcx Folder
var _tcxCourses = new Object();			//tcx Courses(Name, Lap)
var _tcxWptArray = new Array();			//tcx CoursePoint
var _tcxTrkseqArray = new Array();		//tcx Track/Trackpoint*/
function makeObject(xml) {
    let _xmlData = $($.parseXML(xml));

    if (_fileExt.toLowerCase() == 'gpx') {
        $.each(_xmlData.find('gpx').find('trk').find('trkseg').find('trkpt'), function () {
            let trkpt = getGpxTrk(Number($(this).attr('lat')),
                Number($(this).attr('lon')),
                Number($(this).find('ele').text()));
            _gpxTrkseqArray.push(trkpt);    //gpx 경로정보
            _trkPoly.push(new kakao.maps.LatLng($(this).attr('lat'), $(this).attr('lon'))); //polyline을 그리기 위한 정보
        });
    } else if (_fileExt.toLowerCase() == 'tcx') {
        loadTcx(_xmlData);
    }
    moveCenterList(_gpxTrkseqArray);

    //시작과 끝 표시
    makeMarkerPoint(_globalMap, 'start', _gpxTrkseqArray[0]);
    makeMarkerPoint(_globalMap, 'end', _gpxTrkseqArray[_gpxTrkseqArray.length - 1]);

    _drawingManager.put(kakao.maps.drawing.OverlayType.POLYLINE, _trkPoly);

    //let trkpt = _gpxTrkseqArray[parseInt(_gpxTrkseqArray.length / 2)];
    //_globalMap.setCenter(new kakao.maps.LatLng(trkpt.lat, trkpt.lng)); //중심점을 경로상의 중간을 설정한다.
    //_globalMap.setLevel(10);
}

function moveCenterList(pointList) {
    let midPoint = pointList[parseInt(pointList.length / 2)];
    _globalMap.setCenter(new kakao.maps.LatLng(midPoint.lat, midPoint.lng)); //중심점을 경로상의 중간을 설정한다.
    _globalMap.setLevel(7);
}

function moveCenterPoint(kakaoPoint) {
    _globalMap.setCenter(kakaoPoint); //중심점을 경로상의 중간을 설정한다.
    _globalMap.setLevel(7);
}

/*
function loadTcx(x) {
    $.each(x.find('Trackpoint'), function () {
        var trkpt = new Object();
        trkpt.lat = $(this).find('LatitudeDegrees').text();
        trkpt.lon = $(this).find('LongitudeDegrees').text();
        trkpt.ele = $(this).find('AltitudeMeters').text();

        _gpxTrkseqArray.push(trkpt);
        _trkPoly.push(new kakao.maps.LatLng(trkpt.lat, trkpt.lon));
    });
}*/

/*
function getDataFromDrawingMap() {
    // Drawing Manager에서 그려진 데이터 정보를 가져옵니다 
    var data = _drawingManager.getData();

    // 아래 지도에 그려진 도형이 있다면 모두 지웁니다
    removeOverlays();

    // 지도에 가져온 데이터로 도형들을 그립니다
    drawPolyline(data[kakao.maps.drawing.OverlayType.POLYLINE]);
}
*/

function drawPolyline(lines) {
    var len = lines.length, i = 0;
    var path = new Array();
    for (; i < len; i++) {
        path = pointsToPath(lines[i].points);
    }
    _drawingManager.put(kakao.maps.drawing.OverlayType.POLYLINE, path);
}

//Drawing Manager에서 가져온 데이터 중
function pointsToPath(points) {
    var len = points.length, path = [], i = 0;

    for (; i < len; i++) {
        var latlng = new kakao.maps.LatLng(points[i].y, points[i].x);
        path.push(latlng);
        //console.log(latlng);
    }

    return path;
}


function removeOverlays() {
    var len = overlays.length, i = 0;

    for (; i < len; i++) {
        overlays[i].setMap(null);
    }

    overlays = [];
}

//버튼 클릭 시 호출되는 핸들러 입니다
function selectOverlay(type) {
    // 그리기 중이면 그리기를 취소합니다
    _drawingManager.cancel();

    // 클릭한 그리기 요소 타입을 선택합니다
    _drawingManager.select(kakao.maps.drawing.OverlayType[type]);
}

function basePathLoadGpx(gpxfile, strokeColor) {
    let reader = $($.parseXML(gpxfile));
    $.each(reader.find('gpx').find('trk'), function () {
        let trkptList = [];
        $.each($(this).find('trkseg').find('trkpt'), function () {
            trkptList.push(new kakao.maps.LatLng(
                Number($(this).attr('lat')),
                Number($(this).attr('lon')))
            );
        });
        //baseTrkList.push(item); //삭제하기 위한 데이터, 삭제할 필요가 있을까??? 계속 추가해도 좋을듯

        let lineStyle = new kakao.maps.Polyline({
            map: _globalMap,
            path: trkptList,
            strokeColor: strokeColor, // 선의 색깔 '#A52A2A'
            strokeOpacity: 1, // 선의 불투명도, 1에서 0 사이의 값이며 0에 가까울수록 투명
            strokeStyle: 'solid', // 선의 스타일
            strokeWeight: 3
        });
        basePolyline.push(lineStyle);
        moveCenterPoint(trkptList[parseInt(trkptList.length / 2)]);
    });

    $.each(reader.find('gpx').find('wpt'), function () {
        let item = new GpxWaypoint(
            Number($(this).attr('lat')),
            Number($(this).attr('lon')),
            Number($(this).find('ele')),
            $(this).find('name').text(),
            $(this).find('desc').text(),
            $(this).find('type').text(),
            getIconString($(this).find('sym').text())
        );

        //wpt 체크되어 있으면 웨이포인트를 표시한다.
        if ($('#wptIcon').prop('checked'))
            baseWptList.push(new WaypointMark(item.position, item.name, item.uid, item.sym));
    });
}

function WaypointMark(wayPosition, waypointName, uniqueId, waypointIcon) {
    let iconId;
    let content = document.createElement('div');

    content.innerHTML = '<img src=\"images/' + waypointIcon.toLowerCase() + '.png\" class=\"pointImage\"><span class=\"pointText\">' + waypointName + '</span>';
    // 커스텀 오버레이를 생성합니다
    let customoverlay = new kakao.maps.CustomOverlay({
        map: _globalMap,
        clickable: false,
        content: content,
        position: wayPosition
    });

    //customoverlay에 이벤트를 추가한다.
    addEvent();

    function addEvent() {
        //아이콘 클릭, 드래그 이동
        addEventHandle(content, 'mousedown', onMouseDown);

        //아이콘 이동 후 위치
        addEventHandle(document, 'mouseup', onMouseUp);
    }

    // 커스텀 오버레이에 mousedown 했을 때 호출되는 핸들러 입니다
    function onMouseDown(e) {
        //console.log('onMouseDown');
        iconId = uniqueId;

        _customPverlay = true;
        // 커스텀 오버레이를 드래그 할 때, 내부 텍스트가 영역 선택되는 현상을 막아줍니다.
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        var proj = _globalMap.getProjection(); // 지도 객체로 부터 화면픽셀좌표, 지도좌표간 변환을 위한
        // MapProjection 객체를 얻어옵니다
        var overlayPos = customoverlay.getPosition(); // 커스텀 오버레이의 현재 위치를
        // 가져옵니다

        // 커스텀오버레이에서 마우스 관련 이벤트가 발생해도 지도가 움직이지 않도록 합니다
        kakao.maps.event.preventMap();

        // mousedown된 좌표를 설정합니다
        startX = e.clientX;
        startY = e.clientY;

        // mousedown됐을 때의 커스텀 오버레이의 좌표를
        // 지도 컨테이너내 픽셀 좌표로 변환합니다
        startOverlayPoint = proj.containerPointFromCoords(overlayPos);

        // document에 mousemove 이벤트를 등록합니다
        addEventHandle(document, 'mousemove', onMouseMove);
    }

    // 커스텀 오버레이에 mousedown 한 상태에서
    // mousemove 하면 호출되는 핸들러 입니다
    function onMouseMove(e) {
        // 커스텀 오버레이를 드래그 할 때, 내부 텍스트가 영역 선택되는 현상을 막아줍니다.
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        var proj = _globalMap.getProjection(),// 지도 객체로 부터 화면픽셀좌표, 지도좌표간 변환을 위한 MapProjection 객체를 얻어옵니다
            deltaX = startX - e.clientX, // mousedown한 픽셀좌표에서 mousemove한 좌표를 빼서 실제로 마우스가 이동된 픽셀좌표를 구합니다
            deltaY = startY - e.clientY,
            // mousedown됐을 때의 커스텀 오버레이의 좌표에 실제로 마우스가 이동된 픽셀좌표를 반영합니다
            newPoint = new kakao.maps.Point(startOverlayPoint.x - deltaX, startOverlayPoint.y - deltaY),
            // 계산된 픽셀 좌표를 지도 컨테이너에 해당하는 지도 좌표로 변경합니다
            newPos = proj.coordsFromContainerPoint(newPoint);

        _newPosition = newPos;
        customoverlay.setPosition(_newPosition);
        //console.log('uniqueId:' + uniqueId + ', newPos:' + customoverlay.getPosition());

        _customPverlay = false;
    }

    // mouseup 했을 때 호출되는 핸들러 입니다
    function onMouseUp(e) {
        $.each(_wayPointArray, function (index, ele) {
            if (iconId == ele.uid) {
                if (_newPosition instanceof kakao.maps.LatLng) {
                    if (!_customPverlay) {	//웨이포인트의 이동이 없다면 위치 변경은 필요없다.
                        _wayPointArray[index].position = _newPosition;
                    }
                }
                return false;
            }
        });

        // 등록된 mousemove 이벤트 핸들러를 제거합니다
        removeEventHandle(document, 'mousemove', onMouseMove);
    }

    // target node에 이벤트 핸들러를 등록하는 함수힙니다
    function addEventHandle(target, type, callback) {
        if (target.addEventListener) {
            target.addEventListener(type, callback);
        } else {
            target.attachEvent('on' + type, callback);
        }
    }

    // target node에 등록된 이벤트 핸들러를 제거하는 함수힙니다
    function removeEventHandle(target, type, callback) {
        if (target.removeEventListener) {
            target.removeEventListener(type, callback);
        } else {
            target.detachEvent('on' + type, callback);
        }
    }

    return customoverlay;
}

