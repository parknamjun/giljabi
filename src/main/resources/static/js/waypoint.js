
/**
 * http://apis.map.daum.net/web/sample/dragCustomOverlay/
 * 
 * @param {*} mymap 
 * @param {*} wayPosition 
 * @param {*} wayName 
 * @param {*} uniqueId 
 */
let id;
function Waypoint(mymap, wayPosition, waypointName, uniqueId, waypointIcon) {
	// 커스텀 오버레이 엘리먼트를 만들고, 컨텐츠를 추가합니다
    //var position = wayPosition;
	////let waypointName = wayName;	//default
	////let waypointIcon = icon;	//default
	////let uniqueId = uniqueId;
	let content = document.createElement('div');

	content.innerHTML = '<img src=\"images/'+ waypointIcon.toLowerCase() +'.png\" class=\"pointImage\"><span class=\"pointText\">' + waypointName + '</span>';
	 // 커스텀 오버레이를 생성합니다 
	let customoverlay = new kakao.maps.CustomOverlay({
        map: mymap,
        clickable: false,
        content: content,
        position : wayPosition
	});
	
	//customoverlay에 이벤트를 추가한다.
    addEvent();
    
    function addEvent() {
        //마우스가 클릭되면 웨이포인트 정보를 보여주고 수정할 수 있게 한다.
        addEventHandle(content, 'click', onMouseClick);	    

        addEventHandle(content, 'mousedown', onMouseDown);	    
        // mouseup 이벤트가 일어났을때 mousemove 이벤트를 제거하기 위해 document에 mouseup 이벤트를 등록합니다 
        addEventHandle(document, 'mouseup', onMouseUp);
    }

    //모달리스로 입력을 받게 한다.
    function onMouseClick(e) {
    	if(_customPverlay)
    		viewDialog('#viewWaypoint', '웨이포인트', 200, 310);
    }
    
 	function viewDialog(id, title, width, heigth) {
		$('#waypointName').val(waypointName);
		
		//현재 웨이포인트의 아이콘을 Dialog에서 보여준다.
		$('#selectWaypointIcon').attr('src', 'images/' + waypointIcon.toLowerCase() + '.png');
		let currentWaypointName = waypointIcon;
		
		$(id).dialog({
			title: title,
			modal: true,
			resizable: false,
			width: width,
			height: heigth,
			buttons: {
				'Delete': function() {
					//console.log('uniqueID:' + uniqueId);
					$.each(_wayPointArray, function(index, ele) {
						//console.log('uniqueID:' + ele.uid);
						if(uniqueId == ele.uid) {
							_wayPointArray.splice(index, 1);
							customoverlay.setMap(null);
							return false;
						}
					});
					$(this).dialog('close');
				}, 
				'OK': function() {
					//console.log('selectedIcon:' + _pointIcon);
					//웨이포인트명만 변경
					waypointName = $('#waypointName').val();	//현재 웨이포인트의 이름
					content = document.createElement('div');
					if(_pointIcon != '') 	{					//선택된 웨이포인트가 없는 경우
						waypointIcon = _pointIcon;				//현재 포인트의 icon
					} else {
						waypointIcon = currentWaypointName;		//현재 포인트의 icon
					}
					content.innerHTML = '<img src=\"images/'+ waypointIcon.toLowerCase() +'.png\" class=\"pointImage\"><span class=\"pointText\">' + waypointName + '</span>';
				    customoverlay.setContent(content);
				    addEvent();
					_pointIcon = '';
					
					//변경된 웨이포인트명을 웨이포인트 배열에서 변경해준다.
					$.each(_wayPointArray, function(index, ele) {
						if(uniqueId == ele.uid) {
							//console.log('uniqueID:' + ele.uid);
							_wayPointArray[index].waypointname = waypointName;
							_wayPointArray[index].sym = waypointIcon;
							if(_newPosition != undefined) {	//웨이포인트만 클릭된 경우에는 이동이 없으므로 위치의 변동이 없다.
						    	if(!_customPverlay) {	//웨이포인트의 이동이 없다면 위치 변경은 필요없다.
									_wayPointArray[index].position = _newPosition;
								//console.log(_wayPointArray[index].position.toString());
						    	}
							}
							return false;
						}
					});


					$(this).dialog('close');
				}
			}
		});
	}
	
	// 커스텀 오버레이에 mousedown 했을 때 호출되는 핸들러 입니다 
	function onMouseDown(e) {
	    //console.log('onMouseDown');
		id = uniqueId;

		_customPverlay = true;
			// 커스텀 오버레이를 드래그 할 때, 내부 텍스트가 영역 선택되는 현상을 막아줍니다.
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	
		var proj = _map.getProjection(); // 지도 객체로 부터 화면픽셀좌표, 지도좌표간 변환을 위한
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

	    var proj = _map.getProjection(),// 지도 객체로 부터 화면픽셀좌표, 지도좌표간 변환을 위한 MapProjection 객체를 얻어옵니다 
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
		$.each(_wayPointArray, function(index, ele) {
			if(id == ele.uid) {
				if(_newPosition instanceof kakao.maps.LatLng) {
			    	if(!_customPverlay) {	//웨이포인트의 이동이 없다면 위치 변경은 필요없다.
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


};

