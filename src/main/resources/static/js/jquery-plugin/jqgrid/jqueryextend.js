	//년월일시 포맷(yyyy-mm-dd HH:MM:ss)
	$.extend($.fn.fmatter, {
		trtimeFmatter : function(cellvalue, options, rowdata) {
			if(cellvalue == null)
				return "&nbsp;";				
			else
				return dateFormat(toTimeObject(cellvalue), 'yyyy-mm-dd HH:MM:ss');
		},
		dayFmatter : function(cellvalue, options, rowdata) {
			if(cellvalue == null)
				return "&nbsp;";				
			else
				return dateFormat(toTimeObject(cellvalue), 'yyyy-mm-dd');
		},
		daytimeFmatter : function(cellvalue, options, rowdata) {
			if(cellvalue == null)
				return "&nbsp;";				
			else
				return dateFormat(toTimeObject(cellvalue), 'mm-dd HH:MM');
		},
		timeFmatter : function(cellvalue, options, rowdata) {
			if(cellvalue == null)
				return "&nbsp;";				
			else {
				var result = cellvalue.substring(0, 2)+":"+cellvalue.substring(2, 4)+":"+cellvalue.substring(4, 6);
				return result;
			}
		},
		yearmonthFmatter : function(cellvalue, options, rowdata) {
			if(cellvalue == null)
				return "&nbsp;";				
			else
				return dateFormat(toTimeObject(cellvalue+1), 'yyyy-mm');
		},
		accountFormatter : function(cellvalue, options, rowdata) {
			var fixed = 0;
			if(options.colModel.formatoptions.decimalPlaces == undefined)
				fixed = 0;
			else
				fixed = options.colModel.formatoptions.decimalPlaces;
			
			if(cellvalue == null)
				return "&nbsp;";				
			else {
				var value = cellvalue.toFixed(fixed);
				var regx = new RegExp(/(^[+-]?\d+)(\d{3})/);
				
				while(regx.test(value)) {
					value = value.replace(regx, '$1,$2');
				}
				if(cellvalue < 0) 
					value = '▲'+value.replace('-','');
				return value;
			}
		},
		//들여쓰기 추가 20140218
		accountFormatter2 : function(cellvalue, options, rowdata) {
			var fixed = 0;
			if(options.colModel.formatoptions.decimalPlaces == undefined)
				fixed = 0;
			else
				fixed = options.colModel.formatoptions.decimalPlaces;
			
			if(cellvalue == null)
				return "&nbsp;";				
			else {
				var value = cellvalue.toFixed(fixed);
				var regx = new RegExp(/(^[+-]?\d+)(\d{3})/);
				
				while(regx.test(value)) {
					value = value.replace(regx, '$1,$2');
				}
				if(cellvalue < 0){
					value = '▲'+value.replace('-','');
				} else if(cellvalue == 0) {
					value = '-';	
				}
				return value+'&nbsp;';
			}
		},
		// 소수점 추가 2018.12.17
		accountFormatter3 : function(cellvalue, options, rowdata) {
			var fixed = 2;
			if(options.colModel.formatoptions.decimalPlaces == undefined)
				fixed = 2;
			else
				fixed = options.colModel.formatoptions.decimalPlaces;
			
			if(cellvalue == null)
				return "&nbsp;";				
			else {
				var value = cellvalue.toFixed(fixed);
				var regx = new RegExp(/(^[+-]?\d+)(\d{3})/);
				
				while(regx.test(value)) {
					value = value.replace(regx, '$1,$2');
				}
				if(cellvalue < 0){
					value = '▲'+value.replace('-','');
				} else if(cellvalue == 0) {
					value = '-';	
				}
				return value+'&nbsp;';
			}
		},
		//Carrige Return Fommater : 그리드 리스트 내부의 개행문자용 포맷
		textareaFmatter : function(cellvalue, options, rowdata) {
			if(cellvalue == null)
				return "&nbsp;";				
			else
				return cellvalue = cellvalue.replace(/\r\n|\r|\n/g,"<br>");
		}
	});

