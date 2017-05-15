define(['moment', 'text!../tpl/article_view.html', 'text!../pages/caseCenter_opt.html', 'daterangepicker', 'bootstrap_table_export', 'fun', 'ajaxfileupload', 'ckeditor'], function(moment, _view, _opt) {

	var controller = function() {

		var MODEL = "Article";

		/*全局数据*/
		var DATA = {
			page: 1,
			totalPage: 0,
			optType: 0,
			editId: '',
			type:'01'
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

		IMPL.DEL = function(id, callback) {
			$.ajax({
				url: 'admin/delete' + MODEL + 'ById?id=' + id,
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
			FUN.INIT_TABLE();
			EVENT.INIT();
		};

		FUN.INIT_TITLE = function(){
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
			$("#table_title").html(title+"管理");
		};

		FUN.ALERT = function(message, type) {
			if(type) {
				$.scojs_message(message, $.scojs_message.TYPE_OK);
			} else {
				$.scojs_message(message, $.scojs_message.TYPE_ERROR);
			}
		};

		FUN.INIT_TABLE = function() {
			$('#table').bootstrapTable({
				url: 'admin/get' + MODEL + 'sForPage', //请求后台的URL（*）
				method: 'post', //请求方式（*）
				striped: true, //是否显示行间隔色
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				toolbar: "#toolbar",
				sortable: true, //是否启用排序
				sortOrder: "asc", //排序方式
				queryParams: FUN.QUERPARAMS, //传递参数（*）
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				pageNumber: 1, //初始化加载第一页，默认第一页
				pageSize: 10, //每页的记录行数（*）
				pageList: [10, 200], //可供选择的每页的行数（*）
				search: true, //是否显示表格搜索
				strictSearch: false,
				showColumns: true, //是否显示所有的列
				showRefresh: true, //是否显示刷新按钮
				showExport: true,
				minimumCountColumns: 2, //最少允许的列数
				clickToSelect: true, //是否启用点击选中行
				//				height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId: "id", //每一行的唯一标识，一般为主键列
				showToggle: false, //是否显示详细视图和列表视图的切换按钮
				cardView: false, //是否显示详细视图
				detailView: false,
				searchOnEnterKey: true,
				ajax: function(params) {
					var data = JSON.parse(params.data);
					var req = {
						language: data.language,
						categoryId:data.categoryId
					};
					var url = params.url + "?page=" + data.pageNumber;
					if(!_FUN.isNull(data.limit)) {
						url += "&rows=" + data.limit;
					}
					if(!_FUN.isNull(data.sort)) {
						url += "&sort=" + data.sort;
						if(!_FUN.isNull(data.order)) {
							url += "&order=" + data.order;
						}
					}

					$.ajax({
						type: params.type,
						url: url,
						contentType: "application/json",
						dataType: "json",
						data: JSON.stringify(req),
						success: params.success
					});
				},
				columns: [{
					field: 'title',
					title: '标题',
					valign: 'middle',
					align:'center',
					width:"30%"
				}, {
					field: 'summary',
					title: '描述',
					valign: 'middle',
					align:'center',
					width:"30%"
				}, {
					field: 'language',
					title: '语言',
					align:'center',
					width:"20%",
					formatter: function(value, row) {
						var text = '-';
						if(row.language == 'cn') {
							text = '中文';
						} else if(row.language == 'en') {
							text = '英文';
						}
						return text;
					},
					valign: 'middle'
				}, {
					field: 'operate',
					title: '操作',
					align:'center',
					width:"20%",
					formatter: function(value, row) {
						var html = '';
						if(row.status == 0 || row.status == 2) {
							html += '<span class="opt_btn invest_view" data-status="1" data-id="' + row.id + '">上线</span>';
						}
						if(row.status == 1) {
							html += '<span class="opt_btn invest_view" data-status="2" data-id="' + row.id + '">下线</span>'
						}
						html += '<span class="opt_btn invest_edit" data-id="' + row.id + '">修改</span><span class="opt_btn invest_delete" data-id="' + row.id + '">删除</span>';
						return html;
					},
					valign: 'middle'
				}],
				searchHtml: '<div style="float:left;width:100%"><div class="pull-right search"><select class="form-control"  id="language-search"><option value="">语言</option><option value="cn">中文</option><option value="en">英文</option></select></div>'

			});
		};

		FUN.QUERPARAMS = function(params) {
			console.log("参数：", params);
			var temp = {
				type: DATA.type,
				pageNumber: params.pageNumber,
				sort: params.sort,
				order: params.order,
				limit: params.limit,
				language: $("#language-search").val(),
				categoryId:DATA.type
			};
			return temp;
		};

		FUN.REFRESH = function() {
			$('button[name=refresh]').click();
		};

		FUN.SHOW = function(title, tpl, showFooter) {
			$("#modalTitle").html(title);
			$("#modalContent").html(tpl);
			$("#modalBox").show();
			if(showFooter) {
				$("#modalFooter").show();
			}
		};

		FUN.HIDE = function() {
			$("#modalTitle").html("");
			$("#modalContent").html("");
			$("#modalBox").hide();
			$("#modalFooter").hide();
		};

		FUN.EDITOR = function() {
			window.editor = null;
			if(CKEDITOR.env.ie && CKEDITOR.env.version < 9)
				CKEDITOR.tools.enableHtml5Elements(document);
			CKEDITOR.config.height = 250;
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
			/*查看*/
			$("#table").on("click", '.invest_view', function() {
				var id = $(this).attr("data-id");
				var status = $(this).attr("data-status");
				var req = {
					id: id
				};
				IMPL.EDIT(req, function(resp) {
					FUN.ALERT("修改成功", true);
					FUN.REFRESH();
				})
			});

			/*修改*/
			$("#table").on("click", '.invest_edit', function() {
				var id = $(this).attr("data-id");
				DATA.editId = id;
				location.href = "#caseCenter_opt/"+DATA.type+"/"+id;
			});

			/*删除*/
			$("#table").on("click", '.invest_delete', function() {
				DATA.DEL_ID = $(this).attr("data-id");
				$("#confirmDelBox").show();
			});


			/*关闭按钮*/
			$(".box-close").click(function() {
				FUN.HIDE();
			});

			/*取消按钮*/
			$(".boxCancel").click(function() {
				FUN.HIDE();
			});

	
			/*新增按钮*/
			$("#btn_add").click(function() {
				location.href = "#caseCenter_opt/"+DATA.type+"/"+"ADD"
			});

			$('#cancelDel').unbind("click"); 
			$('#confirmDel').unbind("click");
			$("#cancelDel").click(function(){
				$("#confirmDelBox").hide();
			});
			
			$("#confirmDel").click(function(){
				IMPL.DEL(DATA.DEL_ID, function() {
					$("#confirmDelBox").hide();
					FUN.REFRESH();
					$.scojs_message("删除成功", $.scojs_message.TYPE_OK);
				})
			});


		};

		FUN.INIT();

	};
	return controller;
});