$(function() {

	/*全局数据*/
	var DATA = {
		type: 1
	};

	var FUN = {};
	/*事件*/
	var EVENT = {};

	DATA.lang = 'cn';

	FUN.initPage = function() {
		var id = _FUN.getUrlParam("id");

		$.ajax({
			url: '/bybo/admin/getKnowledgeById?id=' + id,
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			success: function(resp) {
				resp = resp.returnValue;
				$("#title").html(resp.title);
				$("#addTime").html(resp.addTime);
				$("#content").html(resp.content);
			}
		});

	}

	FUN.initPage();

})