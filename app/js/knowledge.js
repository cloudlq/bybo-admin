define(['moment', 'text!../tpl/knowledge_view.html', 'text!../tpl/knowledge_opt.html', 'daterangepicker', 'bootstrap_table_export', 'fun', 'ajaxfileupload'], function(moment, _view, _opt) {

	var controller = function() {

		var MODEL = "Knowledge";

		/*全局数据*/
		var DATA = {
			page: 1,
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
			$("#table_title").html("知识库管理");
			DATA.c =_FUN.getSS("knowledge");
			if(!_FUN.isNull(DATA.c)){
				DATA.page = DATA.c.page;
			}
			FUN.clearSS();
			FUN.INIT_TABLE();
			EVENT.INIT();
		};

		FUN.ALERT = function(message, type) {
			if(type) {
				$.scojs_message(message, $.scojs_message.TYPE_OK);
			} else {
				$.scojs_message(message, $.scojs_message.TYPE_ERROR);
			}
		};

		FUN.REND_DEPART = function() {
			var lang = $("#language").val();
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
					html += '<option value="' + item.id + '">' + item.name + '</option>';
				});
				$("#departmentList").html(html);
			})
		};

		FUN.REND_DEPART_EDIT = function(val) {
			var lang = $("#language").val();
			IMPL.GET_DEPART(lang, function(resp) {
				var html = '';
				$.each(resp, function(i, item) {
					html += '<option value="' + item.id + '">' + item.name + '</option>';
				});
				$("#departmentList").html(html);
				$("#departmentList").val(val);
			})
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
				pageNumber: DATA.page, //初始化加载第一页，默认第一页
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
						title: data.title
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
					console.log(params);
				},
				columns: [{
					field: 'title',
					title: '标题',
					align: 'center',
					valign: 'middle',
					width: "40%"
				}, {
					field: 'addTime',
					title: '创建时间',
					align: 'center',
					valign: 'middle',
					width: "20%"
				}, {
					field: 'language',
					title: '语言',
					align: 'center',
					width: "20%",
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
					align: 'center',
					width: "20%",
					formatter: function(value, row) {
						var html = '';
						html += '<span class="opt_btn invest_view" data-id="' + row.id + '">预览</span>';
						html += '<span class="opt_btn invest_edit" data-id="' + row.id + '">修改</span><span class="opt_btn invest_delete" data-id="' + row.id + '">删除</span>';
						return html;
					},
					valign: 'middle'
				}],
				searchHtml: '<div style="float:left;width:100%"><div class="pull-right search"><select class="form-control"  id="language-search"><option value="">语言</option><option value="cn">中文</option><option value="en">英文</option></select></div><div class="pull-right search"><input class="form-control" id="title" type="text" placeholder="请输入标题"></div>'

			});
		};

		FUN.QUERPARAMS = function(params) {
			if(!_FUN.isNull(DATA.c)){
				$("#language").val(DATA.c.language);
				if(!_FUN.isNull(DATA.c.title)){
					$("#title").val(DATA.c.title);
				}
			}
			DATA.page = params.pageNumber;
			var temp = {
				type: DATA.type,
				pageNumber: params.pageNumber,
				sort: params.sort,
				order: params.order,
				limit: params.limit,
				language: $("#language-search").val(),
				title: $("#title").val()
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

		FUN.setSS = function() {
			var c = {
				page: DATA.page,
				language: $("#language-search").val(),
				title: $("#title").val()
			}
			_FUN.setSS("knowledge", c);
		}
		
		FUN.clearSS = function(){
			_FUN.setSS("knowledge", null);
		}

		EVENT.INIT = function() {
			/*查看*/
			$("#table").on("click", '.invest_view', function() {
				var id = $(this).attr("data-id");
				window.open("knowledge_detail.html?id="+id);
			});

			/*修改*/
			$("#table").on("click", '.invest_edit', function() {

				FUN.setSS();

				var id = $(this).attr("data-id");
				DATA.editId = id;
				location.href = "#knowledge_opt/" + id;
			});

			/*删除*/
			$("#table").on("click", '.invest_delete', function() {
				DATA.DEL_ID = $(this).attr("data-id");
				$("#confirmDelBox").show();
			});

			/*添加关联知识库文章*/
			$("#table").on("click", '.invest_addSim', function() {
				var id = $(this).attr("data-id");
				FUN.SHOW("新增", _opt, true);
			});

			/*新增按钮*/
			$("#btn_add").click(function() {
				//				FUN.SHOW("新增", _opt, true);
				//				DATA.optType = 0;
				//				FUN.REND_DEPART();
				FUN.setSS();
				location.href = "#knowledge_opt/ADD";
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

			/*关闭按钮*/
			$(".box-close").click(function() {
				FUN.HIDE();
			});

			/*取消按钮*/
			$(".boxCancel").click(function() {
				FUN.HIDE();
			});

			/*点击上传*/
			$("body").on("click", "#rollpic_uploadPicBtn", function() {
				$("#rollpic_uploadPic").click();
			});

			$('#cancelDel').unbind("click");
			$('#confirmDel').unbind("click");
			$("#cancelDel").click(function() {
				$("#confirmDelBox").hide();
			});

			$("#confirmDel").click(function() {
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