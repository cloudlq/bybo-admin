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
			url: '/qhtcj/resource/getResourceById?id=' + DATA.id,
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
		FUN.INIT_SWIPER();
		EVENT.INIT();
	}

	FUN.INIT_SWIPER = function(){
		var swiper = new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
	        nextButton: '.swiper-button-next',
	        prevButton: '.swiper-button-prev',
	        speed: 600
	    });
	}

	FUN.INIT_PAGE = function() {
		IMPL.GET_INFO(function(resp) {
			var data = resp.returnValue;
			$("#nav-title").html(data.name);
			var type = '';
			var href = '';
			switch(data.type) {
				case 0:
				type = "楼宇资源";
				href = 'resource.html';
					break;
				case 1:
				type = "园区资源";
				href = 'resource-park.html';
					break;
				case 2:
				type = "地产资源";
				href = 'resource-land.html';
					break;
				case 3:
				type = "南部新城";
					break;
				case 4:
					break;
				type = "街区资源";	
				default:
					break;
			}
			
			$("#type").html(type);
//			$("#type").attr('href',href);
			$("#name").html(data.name);
			$("#propertyCompany").html(data.propertyCompany);
			$("#source").html(data.source);
			$("#addTime").html(data.addTime);
			$("#total").html(data.total);
			$("#contactEmail").html(data.contactEmail);
			$("#contactName").html(data.contactName);
			$("#contactPhone").html(data.contactPhone);
			$("#contactQq").html(data.contactQq);
			FUN.SET_DATA("#rent",data.rent);
			FUN.SET_DATA("#propertyFee",data.propertyFee);
			FUN.SET_DATA("#address",data.address);
			FUN.SET_DATA("#nature",data.nature);
			FUN.SET_DATA("#storey",data.storey);
			FUN.SET_DATA("#acreage",data.acreage);
			FUN.SET_DATA("#floorAcreage",data.floorAcreage);
			FUN.SET_DATA("#floorHeight",data.floorHeight);
			FUN.SET_DATA("#elevatorNum",data.elevatorNum);
			FUN.SET_DATA("#parkingNum",data.parkingNum);
			
			
			$("#parkingNum").html(data.parkingNum);
			if(data.hasAirConditioner == 0){
				$("#hasAirConditioner").html("无");
			}else{
				$("#hasAirConditioner").html("中央空调");
			}
			$("#bus").html(data.bus);
			$("#metro").html(data.metro);
			$("#propertyCompany2").html(data.propertyCompany);
			FUN.SET_DATA("#summary",data.summary);
			FUN.SET_DATA("#investmentIntention",data.investmentIntention);
			FUN.SET_DATA("#settledEnterprise",data.settledEnterprise);
			
			if(!_FUN.isNull(data.images)){
				var imgList = data.images.split(",");
				var imgHtml = '';
				var mainHtml = '';
				$.each(imgList, function(i,img) {
					imgHtml +='<img src="'+img+'" />';
					mainHtml += '<div class="swiper-slide" >';
					mainHtml += '<img  height="318px" src="'+img+'" />'	;							
					mainHtml += '</div>';
				
				});
				$("#smallImg").html(imgHtml);
				$("#mainImg").html(mainHtml);
			}
			
			
			

		});
	}

	FUN.SET_DATA = function(node,data){
		if(_FUN.isNull(data)){
			$(node).parent().remove();
		}else{
			$(node).html(data);
		}
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