$(function() {
	
	
	function init(){
		$.ajax({
			url: '/qhtcj/dictionary/getDictionarys',
			type: "POST",
			data: JSON.stringify({"indexes":"home"}),
			contentType: "application/json",
			dataType: "json",
			success:function(resp){
				var list = resp.returnValue;
				var tag = '';
				$.each(list,function(i,item){
					if(item.code == "notice"){
						tag = item.name;
					}
				})
				if(tag == 1){
					initNotice ();
					$(".ch-notis").show();
				}
			}
		});
	
	}
	
	function initNotice (){
		$.ajax({
			url: '/qhtcj/notice/getNotices',
			type: "POST",
			data: JSON.stringify({}),
			contentType: "application/json",
			dataType: "json",
			success: function(resp){
				var data = resp.returnValue;
				if(data.length > 0){
					var notice = data[data.length-1];
					var html = ' <marquee behavior="scroll" style="width:400px" direction="left"> '
					html += notice.content;
					html += '</marquee>'
					$("#notice").html(html);
				}else{
					$("#notice").html("暂无公告")
				}
				
			}
		});
	
	}
	
	init();

})