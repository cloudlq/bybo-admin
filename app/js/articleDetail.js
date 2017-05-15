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
		var req = {
			id: id
		}

		$.ajax({
			url: '/bybo/gw/getArticleById?id=' + id,
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			success: function(resp) {
				resp = resp.returnValue;
				$("#title").html(resp.title);
				$("#author").html(resp.author);
				$("#addTime").html(resp.addTime);
				$("#content").html(resp.content);
			}
		});

	}

	FUN.initPage();

})