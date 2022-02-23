
$(document).ready(function() {
	loginAction();
	
	$('#login').click(function(){
		$.ajax({
			type: 'post',
			url : '/login.do', 
			data: { userid : $('#userid').val()
				, password : $('#password').val()
				},
			dataType:'json',
			async : false,
			complete: function() {
				
			},
			success:function(data, status) {
				if(data.result.resultcode == 'success') {
					window.location.href=data.result.redirectUrl;
				} else {
					alert(data.result.resultmessage);
				}
			}
		});
	});

});

function loginAction() {
	$.ajax({
		type: 'post',
		url : '/login.do', 
		data: { userid : $('#userid').val()
			, password : $('#password').val()
			, command : 'action'
			},
		dataType:'json',
		async : false,
		complete: function() {
			
		},
		success:function(data, status) {

		}
	});

}