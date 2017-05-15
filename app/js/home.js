define(['moment', 'bootstrap_table_export', 'fun', 'ajaxfileupload'], function(moment) {

	var controller = function(type) {
		/*全局数据*/
		var DATA = {
			page: 1,
			type: type,
			totalPage: 0,
			optType: 0,
			editId: ''
		};
		/*功能接口*/
		var IMPL = {};
		/*业务功能*/
		var FUN = {};
		/*事件*/
		var EVENT = {};
		DATA.images = [];
		IMPL.SETHOME = function(req, callback) {
			$.ajax({
				url: 'admin/setHomeDepartment',
				type: "POST",
				data: JSON.stringify(req),
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		IMPL.FIND = function(callback) {
			$.ajax({
				url: 'admin/getRegionDepartmentById',
				type: "GET",
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		IMPL.GET_DEPART = function(lang, callback) {
			$.ajax({
				url: 'admin/getDepartments',
				data: JSON.stringify({
					language: lang
				}),
				type: "POST",
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		/*上传图片*/
		IMPL.UPLOAD_FILE = function(id, callback) {
			$.ajaxFileUpload({
				url: '/bybo/admin/upload',
				secureuri: false,
				fileElementId: id, //file标签的id  
				dataType: 'json', //返回数据的类型  
				success: callback,
				error: function() {
					FUN.ALERT("上传失败", false);
				}
			});
		};

		FUN.INIT = function() {
			$("#table_title").html("首页设置");
			FUN.initPage();
			//			FUN.initImages();
			EVENT.INIT();
		};

		FUN.initPage = function() {
			IMPL.FIND(function(resp) {
				if(_FUN.isNull(resp.regionId)) {
					FUN.REND_DEPART();
				} else {
					var ids = resp.departmentId.split(",");
					FUN.REND_DEPART_EDIT(ids);
					DATA.images = resp.pictures.split(",");
					$("#describe").html(resp.content);
				}
				FUN.initImages();
			});

		}



		FUN.initImages = function() {
			var html = '';
			$.each(DATA.images, function(i, item) {
				html += '<div class="photo_img fl">';
				html += '<img src="' + item + '" alt="" />';
				html += '<a data-id="' + i + '" class="deletePic">删除</a>';
				html += '</div>';
			});
			if(DATA.images.length < 11) {
				html += '<div class="photo_img fl uploadPicBtn">';
				html += '<img src="images/consultation3.png" alt="" />';
				html += '</div>';
			}

			$("#imageList").html(html);
		}

		FUN.ALERT = function(message, type) {
			if(type) {
				$.scojs_message(message, $.scojs_message.TYPE_OK);
			} else {
				$.scojs_message(message, $.scojs_message.TYPE_ERROR);
			}
		};

		FUN.REND_DEPART = function() {
			var lang = "cn";
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
					html += '<label class="checkbox-inline">';
					html += '<input type="checkbox" name="department"  value="' + item.id + '">' + item.name;
					html += '</label>';
				});
				$("#departmentList").html(html);
			})
		};

		FUN.REND_DEPART_EDIT = function( ids) {
			var lang = "cn";
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
					html += '<label class="checkbox-inline">';
					if($.inArray(item.id+"", ids) > -1) {
						html += '<input type="checkbox" name="department" checked="checked" value="' + item.id + '">' + item.name;
					} else {
						html += '<input type="checkbox" name="department"  value="' + item.id + '">' + item.name;
					}

					html += '</label>';
				});
				$("#departmentList").html(html);

			})
		};

		EVENT.INIT = function() {
			//删除照片
			$("body").on("click", ".deletePic", function() {
				var index = Number($(this).attr("data-id"));
				DATA.images.remove(index);
				FUN.initImages();
			});

			/*上传图片*/
			$("body").on("change", "#rollpic_uploadPic", function() {
				IMPL.UPLOAD_FILE("rollpic_uploadPic", function(resp, status) {
					if(resp.code != "0000") {
						return;
					}
					var pic = resp.returnValue;
					DATA.images.push(pic);
					FUN.initImages();
				})
			});

			/*点击上传*/
			$("body").on("click", ".uploadPicBtn", function() {
				$("#rollpic_uploadPic").click();
			});

			//保存、提交
			$("#articleBoxSubmit").click(function(){
				var pictures = DATA.images.join(",");
				
				var checkList = $("input[name=department]:checked");
				var department = "";
				var ids = [];
				$.each(checkList, function(i, node) {
					var v = $(node).val();
					ids.push(v)
				});
				var departmentId = ids.join(",");
				var describe = $("#describe").val();
				var req = {
					pictures:pictures,
					departmentId:departmentId,
					content:describe
				}
				
				IMPL.SETHOME(req,function(resp){
					FUN.ALERT("保存成功",true);
				})
			});

		};

		FUN.INIT();

	};
	return controller;
});