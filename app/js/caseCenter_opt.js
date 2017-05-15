define(['moment', 'text!../tpl/article_view.html', 'text!../pages/caseCenter_opt.html', 'daterangepicker', 'bootstrap_table_export', 'fun', 'ajaxfileupload', 'ckeditor'], function(moment, _view, _opt) {

	var controller = function(type, id) {

		var MODEL = "Article";

		/*全局数据*/
		var DATA = {
			page: 1,
			totalPage: 0,
			optType: 0,
			editId: id,
			type: type
		};
		/*功能接口*/
		var IMPL = {};
		/*业务功能*/
		var FUN = {};
		/*事件*/
		var EVENT = {};

		IMPL.ADD = function(req, callback) {
			$.ajax({
				url: 'admin/insert' + MODEL,
				type: "POST",
				data: JSON.stringify(req),
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		/*修改*/
		IMPL.EDIT = function(req, callback) {
			$.ajax({
				url: 'admin/update' + MODEL + 'ById',
				type: "POST",
				data: JSON.stringify(req),
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		IMPL.FIND = function(id, callback) {
			$.ajax({
				url: 'admin/get' + MODEL + 'ById?id=' + id,
				type: "GET",
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

		FUN.REND_DEPART = function() {
			var lang = $("#language").val();
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
				html += '<option value="'+item.name+'">'+item.name+'</option>';
				});
				$("#departmentList").html(html);
			})
		};
		
		FUN.REND_DEPART_EDIT = function(val) {
			var lang = $("#language").val();
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
				html += '<option value="'+item.name+'">'+item.name+'</option>';
				});
				$("#departmentList").html(html);
				$("#departmentList").val(val);
			})
		};


		FUN.INIT = function() {
			FUN.INIT_TITLE();
//			FUN.EDITOR();
			EVENT.INIT();
			if(DATA.editId == "ADD") {
				DATA.optType = "0";
				FUN.REND_DEPART();
			} else {
				DATA.optType = "1";
				FUN.RENDER_DATA();
			}
		};

		FUN.RENDER_DATA = function() {
			IMPL.FIND(DATA.editId, function(resp) {
				$("#title").val(resp.title);
				$("#summary").val(resp.summary);
				$("#imgPath").attr("src", resp.imageUrl);
				$("#author").val(resp.author);
				$("#language").val(resp.language);
				$("#imgPath2").attr("src", resp.imageUrl2);
//				setTimeout(function(){
//					editor.setData(resp.content);
//				},500)
				
				FUN.REND_DEPART_EDIT(resp.department);
			});
		};

		FUN.INIT_TITLE = function() {
			var title = "案例中心";
			$("#table_title").html("新增" + title);
		};

		FUN.ALERT = function(message, type) {
			if(type) {
				$.scojs_message(message, $.scojs_message.TYPE_OK);
			} else {
				$.scojs_message(message, $.scojs_message.TYPE_ERROR);
			}
		};

		FUN.EDITOR = function() {
			window.editor = null;
			if(CKEDITOR.env.ie && CKEDITOR.env.version < 9)
				CKEDITOR.tools.enableHtml5Elements(document);
			CKEDITOR.config.height = 350;
			CKEDITOR.config.width = 'auto';
			var wysiwygareaAvailable = isWysiwygareaAvailable(),
				isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
			var editorElement = CKEDITOR.document.getById('editor');
			if(isBBCodeBuiltIn) {
				editorElement.setHtml();
			}
			if(wysiwygareaAvailable) {
				editor = CKEDITOR.replace('editor');
			} else {
				editorElement.setAttribute('contenteditable', 'true');
				editor = CKEDITOR.inline('editor');
			}

			function isWysiwygareaAvailable() {
				if(CKEDITOR.revision == ('%RE' + 'V%')) {
					return true;
				}
				return !!CKEDITOR.plugins.get('wysiwygarea');
			}
		};

		EVENT.INIT = function() {

			/*取消按钮*/
			$("#articleBoxCancel").click(function() {
				location.href = "#caseCenter";
			});

			/*提交按钮*/
			$("#articleBoxSubmit").click(function() {
				var summary = $("#summary").val();
				var imageUrl = $("#imgPath").attr("src");
				var title = $("#title").val();
				var author = $("#author").val();
//				var content = editor.getData();
				var language = $("#language").val();
				var department = $("#departmentList").val();
				var imageUrl2 =  $("#imgPath2").attr("src");
				if(_FUN.isNull(title)) {
					$.scojs_message("标题不能为空", $.scojs_message.TYPE_ERROR);
					return;
				}

				var req = {
					title: title,
					summary: summary,
					imageUrl: imageUrl,
					language: language,
					author: author,
//					content: content,
					categoryId: DATA.type,
					imageUrl2:imageUrl2,
					department:department
				};

				if(DATA.optType == '0') {
					IMPL.ADD(req, function(resp) {
						FUN.ALERT("新增成功", true);
						location.href = "#caseCenter";
					});
				} else if(DATA.optType == '1') {
					req.id = DATA.editId;
					IMPL.EDIT(req, function(resp) {
						FUN.ALERT("修改成功", true);
						location.href = "#caseCenter";
					});
				}

			});

			/*取消以前的绑定时间*/
			$("body").off("change", "#rollpic_uploadPic");
			$("body").off("click", "#rollpic_uploadPicBtn");
			$("body").off("change", "#rollpic_uploadPic2");
			$("body").off("click", "#rollpic_uploadPicBtn2");
			$("body").off("change", "#language");
			/*上传图片*/
			$("body").on("change", "#rollpic_uploadPic", function() {
				IMPL.UPLOAD_FILE("rollpic_uploadPic", function(resp, status) {
					if(resp.code != "0000") {
						return;
					}
					var pic = resp.returnValue;
					$("#imgPath").attr("src", pic);
				})
			});

			/*上传图片2*/
			$("body").on("change", "#rollpic_uploadPic2", function() {
				IMPL.UPLOAD_FILE("rollpic_uploadPic2", function(resp, status) {
					if(resp.code != "0000") {
						return;
					}
					var pic = resp.returnValue;
					$("#imgPath2").attr("src", pic);
				})
			});

			/*点击上传*/
			$("body").on("click", "#rollpic_uploadPicBtn", function() {
				$("#rollpic_uploadPic").click();
			});
			
			/*点击上传2*/
			$("body").on("click", "#rollpic_uploadPicBtn2", function() {
				$("#rollpic_uploadPic2").click();
			});
			
			/*变化*/
			$("body").on("change", "#language", function() {
				FUN.REND_DEPART();
			});

		};

		FUN.INIT();

	};
	return controller;
});