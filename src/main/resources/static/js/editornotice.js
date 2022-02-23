
$(document).ready(function() {
	$('#editorNotice').click(function() {
		$.cookie('editorNotice', true);
		console.log($.cookie('editorNotice'));
	});
});
