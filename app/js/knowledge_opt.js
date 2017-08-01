define(['moment', 'text!../tpl/knowledge_view.html', 'text!../tpl/knowledge_opt.html', 'daterangepicker', 'bootstrap_table_export', 'fun', 'ajaxfileupload', 'ckeditor'], function(moment, _view, _opt) {

	var controller = function(id) {
		
		var MODEL = "Knowledge";
		
		/*全局数据*/
		var DATA = {
			page: 1,
			totalPage: 0,
			optType: 0,
			editId: id
		};
		/*功能接口*/
		var IMPL = {};
		/*业务功能*/
		var FUN = {};
		/*事件*/
		var EVENT = {};

		IMPL.ADD = function(req, callback) {
			$.ajax({
				url: 'admin/insert'+MODEL,
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
				url: 'admin/update'+MODEL+'ById',
				type: "POST",
				data: JSON.stringify(req),
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		IMPL.FIND = function(id, callback) {
			$.ajax({
				url: 'admin/get'+MODEL+'ById?id=' + id,
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
		
		IMPL.GET_CATEGORY = function(req, callback) {
			$.ajax({
				url: 'admin/getCategorys',
				data: JSON.stringify(req),
				type: "POST",
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};
		
		IMPL.GET_KNOWLEDGES = function(req,callback){
			$.ajax({
				url: 'admin/getKnowledges',
				type: "POST",
				data: JSON.stringify(req),
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};
		
		
		FUN.REND_KNOWLEDGES = function(){
			var departmentId = $("#departmentList").val();
			var language = $("#language").val();
			var req = {
				departmentId:departmentId,
				language:language
			}
			IMPL.GET_KNOWLEDGES(req,function(resp){
				var html = '';
				$.each(resp, function(i,item) {
					html += '<tr>';
					html += '<td><input type="checkbox" name="similar" value="'+item.id+'" /></td>';
					html += '<td>'+item.id+'</td>';
					html += '<td>'+item.title+'</td>';
					html += '</tr>';						
				});
				$("#similarList").html(html);
				
			});
		}

		FUN.REND_KNOWLEDGES_EDIT = function(departmentId,knowledgeId,similarIds){
			var language = $("#language").val();
			var req = {
				departmentId:departmentId,
				language:language
			}
			IMPL.GET_KNOWLEDGES(req,function(resp){
				var html = '';
				$.each(resp, function(i,item) {
					if(knowledgeId != item.id){
					html += '<tr>';
					if(similarIds.contains(item.id)){
						html += '<td><input type="checkbox" name="similar" checked="checked" value="'+item.id+'" /></td>';
					}else{
						html += '<td><input type="checkbox" name="similar" value="'+item.id+'" /></td>';
					}
					html += '<td>'+item.id+'</td>';
					html += '<td>'+item.title+'</td>';
					html += '</tr>';
					}
						
				});
				$("#similarList").html(html);
				
			});
		}
		

		FUN.REND_CATEGORY = function() {
			var lang = $("#language").val();
			var departmentId = $("#departmentList").val();
			var req = {
				language:lang,
				departmentId:departmentId
			}
			IMPL.GET_CATEGORY(req, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
					html += '<input type="checkbox" name="category" value="'+item.id+"%&%"+item.name+'" /> <span>'+item.name+'</span>';
				});
				$("#categoryList").html(html);
			})
		};

		FUN.REND_CATEGORY_EDIT = function(departmentId,categoryIds) {
			var lang = $("#language").val();
			var req = {
				language:lang,
				departmentId:departmentId
			}
			categoryIds = categoryIds.split(",");
			IMPL.GET_CATEGORY(req, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
					if(categoryIds.contains(item.id)){
						html += '<input type="checkbox" name="category" checked="checked" value="'+item.id+"%&%"+item.name+'" /> <span>'+item.name+'</span>';
					}else{
						html += '<input type="checkbox" name="category" value="'+item.id+"%&%"+item.name+'" /> <span>'+item.name+'</span>';
					}
									
				});
				$("#categoryList").html(html);
			})
		};

		FUN.REND_DEPART = function() {
			var lang = $("#language").val();
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
				html += '<option value="'+item.id+'">'+item.name+'</option>';
				});
				$("#departmentList").html(html);
				FUN.REND_CATEGORY();
				FUN.REND_KNOWLEDGES();
			})
		};
		
		FUN.REND_DEPART_EDIT = function(val,categoryIds) {
			var lang = $("#language").val();
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
				html += '<option value="'+item.id+'">'+item.name+'</option>';
				});
				$("#departmentList").html(html);
				$("#departmentList").val(val);
				FUN.REND_CATEGORY_EDIT(val,categoryIds);
				
			})
		};

		FUN.RENDER_DATA = function() {
			IMPL.FIND(DATA.editId, function(resp) {
				
				$('#language').val(resp.language);
				$("#title").val(resp.title);
				$("#keywords").val(resp.keywords);
				$("#description").val(resp.description);
				setTimeout(function(){
					editor.setData(resp.content);
				},500)
				var departmentId = $("#departmentList").val();
				FUN.REND_DEPART_EDIT(resp.departmentId,resp.categoryIds);
				$("#author").val(resp.author);
				FUN.REND_KNOWLEDGES_EDIT(resp.departmentId,resp.id,resp.similarIds);
				
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
			
			FUN.EDITOR();
			EVENT.INIT();
			if(DATA.editId == "ADD") {
				$("#table_title").html("新增知识库");
				DATA.optType = "0";
				FUN.REND_DEPART();
			} else {
				$("#table_title").html("修改知识库");
				DATA.optType = "1";
				FUN.RENDER_DATA();
			}
			
			
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

			/*提交按钮*/
			$("#articleBoxSubmit").click(function() {
				
				var language = $('#language').val()
				var title = $("#title").val();
				var content = editor.getData();
				var departmentId = $("#departmentList").val();
				var departmentName = $("#departmentList").find("option:selected").text();
				var categoryIds = [];
				var categoryNames =[];
				var author = $("#author").val();
				$('input[name="category"]:checked').each(function(){
					var value = $(this).val();
					categoryIds.push(value.split("%&%")[0]);
					categoryNames.push(value.split("%&%")[1]);
				}); 
				
				categoryIds =categoryIds.join(",");
				categoryNames = categoryNames.join(",");
				
				var similarIds = [];
				$('input[name="similar"]:checked').each(function(){
					var value = $(this).val();
					similarIds.push(value);
				}); 
				
				var keywords = $("#keywords").val();
				var description = $("#description").val();
				
				var req = {
					title: title,
					language: language,
					content: content,
					author: author,
					departmentId: departmentId,
					departmentName: departmentName,
					categoryIds: categoryIds,
					categoryNames: categoryNames,
					similarIds:similarIds,
					keywords:keywords,
					description:description
				};

				if(DATA.optType == '0') {
					IMPL.ADD(req, function(resp) {
						FUN.ALERT("新增成功", true);
						location.href = "#knowledge";
					});
				} else if(DATA.optType == '1') {
					req.id = DATA.editId;
					IMPL.EDIT(req, function(resp) {
						FUN.ALERT("修改成功", true);
						location.href = "#knowledge";
					});
				}

			});

			/*取消按钮*/
			$("#articleBoxCancel").click(function() {
				location.href = "#knowledge";
			});
			
			$("#departmentList").change(function(){
				FUN.REND_CATEGORY();
				FUN.REND_KNOWLEDGES();
			});

		};

		FUN.INIT();

	};
	return controller;
});