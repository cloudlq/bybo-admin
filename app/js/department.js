define(['moment', 'text!../tpl/department_view.html', 'text!../tpl/department_opt.html', 'daterangepicker', 'bootstrap_table_export', 'fun', 'ajaxfileupload'], function(moment, _view, _opt) {

	var controller = function() {
		
		var MODEL = "Department";
		
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

		IMPL.DEL = function(id, callback) {
			$.ajax({
				url: 'admin/delete'+MODEL+'ById?id=' + id,
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
			$("#table_title").html("诊疗科室管理");
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

		FUN.INIT_TABLE = function() {
			$('#table').bootstrapTable({
				url: 'admin/get'+MODEL+'sForPage', //请求后台的URL（*）
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
				pageList: [10,200], //可供选择的每页的行数（*）
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
						language: data.language
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
					field: 'name',
					title: '科室名称',
					valign: 'middle',
					align:'center',
					width:"15%"
				}, {
					field: 'summary',
					title: '简介',
					valign: 'middle',
					halign:'center',
					width:"55%"
				}, {
					field: 'language',
					title: '语言',
					align:'center',
					width:"15%",
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
					width:"15%",
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
				language:$("#language-search").val()
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
				IMPL.FIND(id, function(resp) {
					DATA.optType = 1;
					
					FUN.SHOW("修改", _opt, true);
					$("#name").val(resp.name);
					$("#summary").val(resp.summary);
					$("#imgPath").attr("src", resp.picture);
					$("#service").val(resp.service);
					$("#language").val(resp.language);
					$("#technical").val(resp.technical);
					$("#imgPath1").attr("src", resp.icon);
					$("#imgPath2").attr("src", resp.icon2);
					$("#keywords").val(resp.keywords);
					$("#description").val(resp.description);
				});
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

			/*提交按钮*/
			$(".boxSubmit").click(function() {
				var name = $("#name").val();
				var summary = $("#summary").val();
				var picture = $("#imgPath").attr("src");
				var technical = $("#technical").val();
				var service = $("#service").val();
				var language = $('#language').val();
				var keywords = $("#keywords").val();
				var description = $("#description").val();
				
				var url = $("#url").val();
				var icon =  $("#imgPath1").attr("src");
				var icon2 =  $("#imgPath2").attr("src");
				if(_FUN.isNull(name)) {
					$.scojs_message("名称不能为空", $.scojs_message.TYPE_ERROR);
					return;
				}
				
				if(_FUN.isNull(imgPath)) {
					$.scojs_message("图片不能为空", $.scojs_message.TYPE_ERROR);
					return;
				}
				
				var req = {
					name: name,
					summary: summary,
					picture: picture,
					language: language,
					technical:technical,
					service: service,
					icon:icon,
					icon2:icon2,
					keywords:keywords,
					description:description
				};

				if(DATA.optType == '0') {
					IMPL.ADD(req, function(resp) {
						FUN.HIDE();
						FUN.ALERT("新增成功", true);
						FUN.REFRESH();
					});
				} else if(DATA.optType == '1') {
					req.id = DATA.editId;
					IMPL.EDIT(req, function(resp) {
						FUN.HIDE();
						FUN.ALERT("修改成功", true);
						FUN.REFRESH();
					});
				}

			});

			/*新增按钮*/
			$("#btn_add").click(function() {
				FUN.SHOW("新增", _opt, true);
				DATA.optType = 0;
			});

			/*取消以前的绑定时间*/
			$("body").off( "change", "#rollpic_uploadPic");
			$("body").off( "click", "#rollpic_uploadPicBtn");
			$("body").off( "change", "#rollpic_uploadPic1");
			$("body").off( "click", "#rollpic_uploadPicBtn1");
			$("body").off( "change", "#rollpic_uploadPic2");
			$("body").off( "click", "#rollpic_uploadPicBtn2");
			
			/*上传图片*/
			$("body").on("change","#rollpic_uploadPic",function(){
				IMPL.UPLOAD_FILE("rollpic_uploadPic", function(resp, status) {
					if(resp.code != "0000") {
						return;
					}
					var pic = resp.returnValue;
					$("#imgPath").attr("src", pic);
				})
			});

			/*点击上传*/
			$("body").on("click","#rollpic_uploadPicBtn",function(){
				$("#rollpic_uploadPic").click();
			});
			
			/*上传图片*/
			$("body").on("change","#rollpic_uploadPic1",function(){
				IMPL.UPLOAD_FILE("rollpic_uploadPic1", function(resp, status) {
					if(resp.code != "0000") {
						return;
					}
					var pic = resp.returnValue;
					$("#imgPath1").attr("src", pic);
				})
			});

			/*点击上传*/
			$("body").on("click","#rollpic_uploadPicBtn1",function(){
				$("#rollpic_uploadPic1").click();
			});
			
			
			/*上传图片*/
			$("body").on("change","#rollpic_uploadPic2",function(){
				IMPL.UPLOAD_FILE("rollpic_uploadPic2", function(resp, status) {
					if(resp.code != "0000") {
						return;
					}
					var pic = resp.returnValue;
					$("#imgPath2").attr("src", pic);
				})
			});

			/*点击上传*/
			$("body").on("click","#rollpic_uploadPicBtn2",function(){
				$("#rollpic_uploadPic2").click();
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