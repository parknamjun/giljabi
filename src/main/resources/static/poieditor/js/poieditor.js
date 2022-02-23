var _map;
var _photo;

$(document).ready(function() {
	var options = {
		center: new daum.maps.LatLng(37.566535, 126.97796919999996), //Seoul city hall
		level: 8
	};
	_map = new daum.maps.Map(document.getElementById('map'), options);
	
	var mapTypeControl = new daum.maps.MapTypeControl(); // 지도타입 컨트롤
	_map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
	
	// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
	var zoomControl = new daum.maps.ZoomControl();
	_map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
	

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
	
	//gpx file loading....
	$('#poiupload').click(function() { 
		var popOption = "width=350, height=380, resizable=no, scrollbars=no, status=no;"; 
		window.open('fileupload.html', 'text', popOption);
	});
	
	daum.maps.event.addListener(_map, 'dragend', function() {
		for (var i = 0; i < _markerList.length; i++) {
			_markerList[i].setMap(null);
	    }
		var bounds = _map.getBounds();
		getPoi(bounds);
	});

	// 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
	daum.maps.event.addListener(_map, 'zoom_changed', function() {
	    // 지도의 현재 레벨을 얻어옵니다
	    //var level = _map.getLevel();   
	    //console.log('현재 지도 레벨은 ' + level + '입니다');
		var bounds = _map.getBounds();
		getPoi(bounds);
	});

});

function poiLocation() {
	var posistion = new daum.maps.LatLng(Number(_photo.lat), Number(_photo.lng));
	var marker = new daum.maps.Marker({
	    position: posistion
	});
	marker.setMap(_map);
	_map.setCenter(posistion);
}


