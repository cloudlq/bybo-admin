define(['moment', 'fun', 'ajaxfileupload', 'ckeditor'], function() {

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

		var editor = null;
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

		FUN.INIT = function() {
			FUN.INIT_TITLE();
			FUN.EDITOR();
			EVENT.INIT();
			if(DATA.editId == "ADD") {
				DATA.optType = "0";
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
				$("#keywords").val(resp.keywords);
				$("#description").val(resp.description);
				setTimeout(function(){
//					var body =	$("iframe").contents().find("body");
//					body.html(resp.content);
					editor.setData(resp.content);
				},500)
			});
		};

		FUN.INIT_TITLE = function() {
			var title = "";
			switch(DATA.type) {
				case "00":
					title = "诊疗项目";
					break;
				case "01":
					title = "案例中心";
					break;
				case "02":
					title = "校企合作";
					break;
				case "03":
					title = "学术交流";
					break;
				case "04":
					title = "社会责任";
					break;
				case "05":
					title = "拜博资讯";
					break;
				case "06":
					title = "课题交流";
					break;
				default:
					break;
			}
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
				location.href = "#article/" + DATA.type;
			});

			/*提交按钮*/
			$("#articleBoxSubmit").click(function() {
				var summary = $("#summary").val();
				var imageUrl = $("#imgPath").attr("src");
				var title = $("#title").val();
				var author = $("#author").val();
				var content = editor.getData();
				var language = $("#language").val();
				var keywords = $("#keywords").val();
				var description = $("#description").val();
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
					content: content,
					categoryId: DATA.type,
					keywords:keywords,
					description:description
				};

				if(DATA.optType == '0') {
					IMPL.ADD(req, function(resp) {
						FUN.ALERT("新增成功", true);
						location.href = "#article/" + DATA.type;
					});
				} else if(DATA.optType == '1') {
					req.id = DATA.editId;
					IMPL.EDIT(req, function(resp) {
						FUN.ALERT("修改成功", true);
						location.href = "#article/" + DATA.type;
					});
				}

			});

			/*取消以前的绑定时间*/
			$("body").off("change", "#rollpic_uploadPic");
			$("body").off("click", "#rollpic_uploadPicBtn");

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

			/*点击上传*/
			$("body").on("click", "#rollpic_uploadPicBtn", function() {
				$("#rollpic_uploadPic").click();
			});

		};

		FUN.INIT();

	};
	return controller;
});