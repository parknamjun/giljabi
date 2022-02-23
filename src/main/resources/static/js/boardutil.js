
	var golbal_NOTDEF = -1;
	var golbal_INSERT = 0;
	var golbal_UPDATE = 1;
	var golbal_DELETE = 2;
	var golbal_SELECT = 3;
	var golbal_VIEW = 4;
	var golbal_EXCEL = 13;
	

	function createDate(id) {
		$(id).datepicker({
			defaultDate:new Date(), dateFormat:'yymmdd', showOtherMonths: true,
			selectOtherMonths:true, showMonthAfterYear:false
		});
	}
	function createDate(id, date) {
		$(id).datepicker({
			defaultDate: new Date(), dateFormat:'yymmdd', showOtherMonths: true,
			selectOtherMonths:true, showMonthAfterYear:false
		});
		
		if(date == null) {
			$(id).val($.datepicker.formatDate('yymmdd', date));
		} else {
			if(date.constructor === Number) {
				var initDate = new Date();
				initDate.setDate(initDate.getDate() + date);
				$(id).val($.datepicker.formatDate('yymmdd', initDate));
			} else if(date instanceof Date)
				$(id).val($.datepicker.formatDate('yymmdd', date));
		}
	}
	
	function isString(s) {
		return typeof(s) === 'string' || s instanceof String;
	}
	
	/**
	http://jquery.malsup.com/block/
	$(document).ajaxStop($.unblockUI);
	*/
	function requestPage(requestMethod, formid, method, requestUrl) {
		$.blockUI({ 
			message: '<div class="blocking"><img src="/wcdms3/images/busy.gif" /> Just a moment...</div>',
			css: { backgroundColor: '#fff', color: '#fff' } 
		}); 
	    ajaxRequest(requestMethod, formid, method, requestUrl);  
	}

	/**
	 * null
	 * @param value
	 * @param replacer
	 * @returns
	 */
	function nvl(value, replacer) {
		if ( value == null){
			return replacer;
		} else {
			return value;
		}
	}
	/**
	 * @param a
	 * @param p
	 * @returns {String}
	 */
	function arrayToJson(a, p) {
		var i, s = '[';
		for (i = 0; i < a.length; ++i) {
			if (typeof a[i] == 'string') {
			s += '"' + a[i] + '"';
			} else { // assume number type
			s += a[i];
			}
			if (i < a.length - 1) {
			s += ',';
			}
		}
		s += ']';	
		if (p) {
			return '{"' + p + '":' + s + '}';
		}
		return s;
	}
	
	function ajaxListView(requestData, requestUrl, tableid) {
		$.ajax({
			type: "post",
			url : requestUrl, 
			data: requestData,
			dataType:"json",
			async: false,
			success:function(data, status) {
				if(data.resultCode == 'success') {
					tableView(data, status, tableid);
				} else {
					alert(data.resultMessage);
				}
			}
		});
	}
	
	/**
	 * url :
	 * callback :
	 * async : true/false
	 * 
	 * readyState : 0(Not Init.), 1(ahs been set up), 2(has been send), 3(is in porcess), 4(is complete)
	 */
	function ajaxHttp(url, callback, async) {
		var xmlHttp = null;
		try {
			xmlHttp = new XMLHttpRequest();					//ie7
		} catch(e) {
			ret = new ActiveXObject("Microsoft.XMLHTTP");	//ie6
		}
		
		xmlHttp.open("GET", url, async);
		xmlHttp.onreadystatechange = (function() {
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				eval("var data = (" + xmlHttp.responseText + ")");
				callback(data);
			}
		});
		
		if(xmlHttp.readyState == 4)
			return;
		
		xmlHttp.send("GET");	
	}

	/**
	 * by jquery
	 * @param rUrl
	 * @param requestData
	 * @param callback
	 * @returns {Boolean}
	 */
	function ajax(rUrl, requestData, callback, async) {
		var result = false;
		$.ajax({
			type: 'post',
			url : rUrl, 
			data: requestData,
			dataType:'json',
			async : async,
			complete: function() {
				$(document).ajaxStop($.unblockUI);
			},
			success:function(data, status) {
				if(data.resultCode == 'success') {
					result = true;
					callback(data);
				} else {
					alert(data.resultMessage);
				}
			}
		});
		return result;
	}
	
	 //makeCombobox("common3", "hcashteam_query", "#hcashteam_id");
	function makeCombobox(namespace, sqlid, id, selected) {
		var options = "";
		var requestData;
		
		if(selected !== undefined) {
			requestData = {"namespace": namespace, "sqlid": sqlid};
		} else {
			requestData = {"namespace": namespace, "sqlid": sqlid, "option": selected};
		}
		$.ajax({
			type:'post',
			url : '/swfs1/select.do', //select method fixed.
			dataType:'json',
			data: requestData, 
			async : false,
			success:function(data, status) {
				options += "<option value=''>--</option>";
				$.each(data.resultlist, function(i, option) {
					options += "<option value='" + option.VALUE + "'>" + option.NAME + "</option>";
				});
				$(id).html(options);
			}
		});
	}

	/**
	 * 
	 * @param startYear
	 * @param id ("#year")
	 */
	function yearCombo(startYear, id) {
		var start = parseInt(startYear);
		var end = parseInt(getYear());
		var currYear = getYear();
		var html = "";
		for(start; start <= end; start++) {
			if(currYear == start)
				html += "<option value='"+start+"' selected>" + start + "</option>";
			else
				html += "<option value='"+start+"'>" + start + "</option>";
		}
		$(id).append(html);	
	}
	
	/**
	 * 
	 * @param id ("#month")
	 */
	function monthCombo(id) {
		var month = parseInt(getMonth());
		var currMonth = getMonth();
		var html = "";
		for(var i = 1; i <= 12; i++) {
			if(i < 10) {
				if(currMonth == ("0"+i))
					html += "<option value='0"+i+"' selected>0" + i + "</option>";
				else
					html += "<option value='0"+i+"'>0" + i + "</option>";
			} else {
				if(currMonth == (i+""))
					html += "<option value='"+i+"' selected>" + i + "</option>";
				else
					html += "<option value='"+i+"'>" + i + "</option>";
			}
		}
		$(id).append(html);	
	}

	//excel file download start
	function excelStartBlocking(formid) {
		$('body').block({ 
			fadeIn : 1000,
			message: '<div class="blocking"><img src="/wcdms3/images/busy.gif" />&nbsp;&nbsp;Downloading excel file. please wait...</div>'
		});
	}
	//excel filed download stop
	function excelEndBlocking(formid) {
		if(document.readyState == "complete"){
			$('body').unblock({fadeOut: 1000});
		}
	}	
