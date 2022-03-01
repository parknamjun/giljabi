/**
 * editor, gpx2tcx 공통 사용
 * @type {boolean}
 * @private
 */
let _firstFileOpenFlag = false;	//파일을 merge 하려면 파일이 먼저 열려있어야 한다.
let _uploadFilename = '';	//업로드된 파일명
let _customOverlay = false;	//커스텀 오버레이가 이동상태인지 확인하는 플래그
let _pointIcon = '';		//웨이포인트 변경하는 dialog에서 선택한 아이콘
let _trkPoly = [];
let _wayPointArray = [];	//_way, waypoint 배열정보

let _markerList = [];
let _certiFlag = false;	//인증센터 조회유무

//var _markerListCvs = [];
let _cvsFlag = false;	//편의점 POI


/**
	 */
	let _mapTypes = {
		terrain : kakao.maps.MapTypeId.TERRAIN,
		bicycle : kakao.maps.MapTypeId.BICYCLE
	};

	let _waypointIcons = 'danger,flag,food,generic,left,straight,right,sprint,summit,water,waypoint,valley,servicestation,residence,웨이포인트';
/*
	function ajax(rUrl, requestData, callback) {
		$.ajax({
			type: 'post',
			url : rUrl, 
			data: requestData,
			dataType:'json',
			async : false,
			complete: function() {
				//$(document).ajaxStop($.unblockUI);
			},
			success:function(data, status) {
				callback(data);
			}
		});
	}
*/

/**
 * 파일명에 특수문자가 있을 경우에 사용하려는데....
 * @param str
 * @returns {boolean}
 */
	function checkSpecial(str) { 
		let pattern = /[`<~!@#$%^&*|\\'\";:\/?]/gi;
		return pattern.test(str);
	}
/*
	function detectmob() { 
		 if( navigator.userAgent.match(/Android/i)
		 || navigator.userAgent.match(/webOS/i)
		 || navigator.userAgent.match(/iPhone/i)
		 || navigator.userAgent.match(/iPad/i)
		 || navigator.userAgent.match(/iPod/i)
		 || navigator.userAgent.match(/BlackBerry/i)
		 || navigator.userAgent.match(/Windows Phone/i)
		 ) {
		    return true;
		 } else {
		    return false;
		 }
	}
*/

/**
 * url parameter를 사용할때...
 * @param name
 * @param url
 * @returns {null|string}
 */
	function getParam(name, url ) {
	    if(!url)
	    	url = location.href;
	    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	    let regex = new RegExp("[\\?&]"+name+"=([^&#]*)");
	    let results = regex.exec( url );
	    return results == null ? null : results[1];
	}

/**
 * 다음 버전에 추가
 * 지도상의 시설물정보....
 * @param map
 * @param bounds
 * @param level
 */
/*
	function getPoi(map, bounds, level) {
		$.ajax({
			type: 'post',
			url : '/poiview.do', 
			data: { northeast : bounds.getNorthEast().getLat() + ',' + bounds.getNorthEast().getLng()
				, southwest : bounds.getSouthWest().getLat() + ',' + bounds.getSouthWest().getLng()
				, certiCheck : _certiFlag
				//, cvsCheck : _cvsFlag
				, level : level
			},
			dataType:'json',
			async : false,
			success:function(result, status) {
				let imageSrc = window.location.origin+'/images/'; // 마커이미지의 주소입니다
				if(result.resultcode == 'success') {
					$.each(result.resultlist, function(index, ele) {
						let imageSize, imageOption;
						if(ele.POITYPE == '01') {
							imageSize = new kakao.maps.Size(33, 40); // 마커이미지의 크기입니다 64, 69
							imageOption = {offset: new daum.maps.Point(17, 40)}; //27, 69
						} else {
							imageSize = new kakao.maps.Size(22, 24); // 마커이미지의 크기입니다 64, 69
							imageOption = {offset: new daum.maps.Point(11, 24)}; //27, 69
						}
						let markerImage = new kakao.maps.MarkerImage(imageSrc + ele.ICON, imageSize, imageOption);
						let marker = new kakao.maps.Marker({
						    position: new kakao.maps.LatLng(ele.LAT, ele.LNG),
						    clickable: true, 
						    image: markerImage // 마커이미지 설정 
						});
						marker.setMap(map);

						let iwContent = '<div>'
							+ele.POINAME+'<br>'
							+'</div>', 
						    iwRemoveable = true; 

						// 인포윈도우를 생성합니다
						let infowindow = new daum.maps.InfoWindow({
						    content : iwContent,
						    removable : iwRemoveable
						});
						// 마커에 클릭이벤트를 등록합니다
						daum.maps.event.addListener(marker, 'click', function() {
						      // 마커 위에 인포윈도우를 표시합니다
						      infowindow.open(map, marker);  
						});
						_markerList.push(marker);
					});
				} else {
					alert(data.resultmessage);
				}
			}
		});
	}
	*/

	/*
	var regExp = /\s/g; //모든 공백 체크 정규식
	var regExp = /^[0-9]+$/; //숫자만 체크 정규식
	var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; //이메일 체크 정규식
	var regExp = /^\d{3}-\d{3,4}-\d{4}$/; //핸드폰번호 정규식
	var regExp = /^\d{2,3}-\d{3,4}-\d{4}$/; //일반 전화번호 정규식
	var regExp = /^[a-z0-9_]{4,20}$/; //아이디나 비밀번호 정규식 
	var regExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/; //휴대폰번호 체크 정규식 
	*/
	/*
	function checkPattern(type, checkValue) {
		if(type = 'PHONE') {
			let regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
			if(regExp.test(checkValue)) return true;
			else return false;
		} else if(type = 'EMAIL') {
			let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
			if(regExp.test(checkValue)) return true;
			else return false;
		}
	}
	*/
/*
	//adfit 호출실패시 사용되는 콜백함수
	function callBackAdfit(elm) {  
	    text = [];  
	    text.push('<ins class="adsbygoogle"');  
	    text.push('style="display:inline-block;width:250px;height:250px"');  
	    text.push('data-ad-client="ca-pub-7893835816116192"');  
	    text.push('data-ad-slot="5918517081"></ins>');  
	   
	    elm.innerHTML = text.join(' ');  
	    (adsbygoogle = window.adsbygoogle || []).push({});  
	}
*/
	//첫 화면에서 서울 위치, 우리집으로 할까나..
	function getLocation() {
		return new kakao.maps.LatLng(37.56683546665817, 126.9786607449023);
	}

	//첫문자를 대문자로 변경
	function capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	//POI 정보 삭제
	function removePoi(list) {
		for (let i = 0; i < list.length; i++) {
			list[i].setMap(null);
	    }
	}
/*
	function includeHTML() {
		let tagNamelist = document.getElementsByTagName("*");
		for (let i = 0; i < tagNamelist.length; i++) {
			let elmnt = tagNamelist[i];
			let file = elmnt.getAttribute("w3-include-html");
			if (file) {
				let xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {
							elmnt.innerHTML = this.responseText;
						}
						if (this.status == 404) {
							elmnt.innerHTML = "Page not found.";
						}
						elmnt.removeAttribute("w3-include-html");
						includeHTML();
					}
				}
				xhttp.open("GET", file, true);
				xhttp.send();
				return;
			}
		}
	}
*/
/*
	function adsview(id) {
		adblockDetector.init({
	        found: function () {
	        	console.log('Ing....');
	        	ajax('/adsview.do', { callname : id }, function(data) {
	        		if(data.resultcode == 'success')
	        			alert(data.resultmessage);
	        	});
	        },
	        notFound: function () {
	        	console.log('Thanks...')
	        }
	    });
	}
*/
/*
	function removeArray(array, startIndex, endIndex) {
		return array.splice(startIndex, endIndex - startIndex);
	}
*/
	/**
	 * 숫자 comma 추가
	 * @param x
	 * @returns
	 */
	function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
