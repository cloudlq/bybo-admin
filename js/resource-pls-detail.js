$(function() {

	/*全局数据*/
	var DATA = {};
	/*功能接口*/
	var IMPL = {};
	/*业务功能*/
	var FUN = {};
	/*事件*/
	var EVENT = {};

	IMPL.GET_INFO = function(callback) {
		$.ajax({
			url: '/qhtcj/park/getParkById?id=' + DATA.id,
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			success: callback
		});
	}

	FUN.INIT = function() {
		var id = _FUN.getUrlParam("id");
		DATA.id = id;
		FUN.INIT_PAGE();
		EVENT.INIT();
	}


	FUN.INIT_PAGE = function() {
		IMPL.GET_INFO(function(resp) {
			var data = resp.returnValue;
			$("#nav-title").html(data.name);
			var type = '';
			var href = '';
			switch(data.type) {
				case 1:
				type = "园区资源";
				href = 'resource-pls.html?type=1';
					break;
				case 2:
				type = "地产资源";
				href = 'resource-pls.html?type=2';
					break;
				case 3:
				type = "街区资源";
				href = 'resource-pls.html?type=3';
					break;
				default:
					break;
			}
			
			$("#type").html(type);
			$("#nav-title").html(data.name);
			$("#name").html(data.name);
			$("#source").html(data.source);
			
			$("#updateTime").html(data.addTime);
			$("#total").html(data.total);
			$("#baseDetail").html(data.baseDetail);
			$("#address").html(data.address);
			$("#summary").html(data.summary);
			console.log($("#summary").parent());
			if(_FUN.isNull(data.baseDetail)){
				$("#baseDetail").prev().remove();
			}
			if(_FUN.isNull(data.address)){
				$("#address").prev().remove();
			}
			if(_FUN.isNull(data.summary)){
				$("#summary").prev().remove();
			}
		
			if(!_FUN.isNull(data.images)){
				var imgList = data.images.split(",");
				var imgHtml = '';
				var mainHtml = '';
				$.each(imgList, function(i,img) {
					imgHtml +='<img src="'+img+'" />';
				
				});
				$(".resource-park-img").html(imgHtml);
			}
			
			
			

		});
	}

	EVENT.INIT = function() {
		$("body").delegate(".investment-item", "click", function() {
			var id = $(this).attr('data-id');
			location.href = "investment-detail.html?id=" + id;
		});
		
		$(".ch-menu-box>ul>li").click(function(){
			var index = $(this).attr("data-id");
			location.href = "index.html#"+index;
		});
		
		$("li[data-id='resource']").addClass("cur");
		
	};

	FUN.INIT();

})