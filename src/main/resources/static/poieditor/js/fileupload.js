$(document).ready(function() {
	function callOpener(data) {
		opener._photo = data;
		opener.poiLocation();
	}

	$('#uploadbutton').click(function() {
		
		$("#poifileform").ajaxForm({
	    	context: this,
	        url : "/poiupload.do",
	        enctype : "multipart/form-data",
	        data : {command:"poi"
	        	, poiname:$('#poiname').val()
	        	, poitype:$("#poitype option:selected").val() 
	        	, poitext:$('#poitext').val()
	        	, poiphoneno:$('#poiphoneno').val()
	        	},
	        dataType : "json",
	        beforeSubmit: function(data, frm, opt) { 
		    		if(data[0].value == '') {
		    			alert('파일이 없습니다.');
		    			return false;
		    		}

	        	},
	        success : function(result){
	            if(result.resultcode == 'success') {
	            	alert(result.resultmessage);
	            	self.close();
	            } else 
	            	alert(result.resultmessage);
	        }
	    });
	    $("#poifileform").submit();
	});
});



