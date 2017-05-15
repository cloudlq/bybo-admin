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
			url: '/qhtcj/investment/getInvestmentById?id='+DATA.id,
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			success: callback
		});
	}
	
	IMPL.GET_LIST = function(req, callback) {
		$.ajax({
			url: '/qhtcj/investment/getInvestmentsForPage?page='+DATA.page,
			type: "POST",
			data: JSON.stringify(req),
			contentType: "application/json",
			dataType: "json",
			success: callback
		});
	}
	
	FUN.INIT = function(){
		var id = _FUN.getUrlParam("id");
		DATA.id = id;
		FUN.INIT_PAGE();
		EVENT.INIT();
	}
	
	FUN.INIT_PAGE = function(){
		IMPL.GET_INFO(function(resp){
			var data = resp.returnValue;
			$("#title").html(data.title);
			$("#nav-title").html(data.title)
			$("#updateTime").html(data.updateTime);
			$("#total").html(data.total);
			$("#source").html(data.source);
			$("#content").html(data.content);
			if(data.type == 1){
				$("#type").html("<a href='#'>招商政策</a>");
			}else{
				$("#type").html("<a href='#'>服务流程</a>");
			}
		});
	}
	
	EVENT.INIT = function(){
		$("body").delegate(".investment-item","click",function(){
			var id = $(this).attr('data-id');
			location.href = "investment-detail.html?id="+id;
		});
		
		$(".ch-menu-box>ul>li").click(function(){
			var index = $(this).attr("data-id");
			location.href = "index.html#"+index;
		});
		
		$("li[data-id='investment']").addClass("cur");
	};
	
	
	FUN.INIT();

})