define([ 'fun'], function() {

	var controller = function() {

		/*功能接口*/
		var IMPL = {};
		/*业务功能*/
		var FUN = {};
		/*事件*/
		var EVENT = {};

		/*修改*/
		IMPL.CHANGE = function(oldPwd,newPwd, callback) {
			$.ajax({
				url: 'party/changePassword?oldPassword='+oldPwd+'&newPassword='+newPwd,
				type: "POST",
				data: JSON.stringify({}),
				contentType: "application/json",
				dataType: "json",
				success: callback
			});
		};

		FUN.INIT = function() {
            $("#table_title").html("修改密码");
			EVENT.INIT();
		};

		FUN.ALERT = function(message, type) {
			if(type) {
				$.scojs_message(message, $.scojs_message.TYPE_OK);
			} else {
				$.scojs_message(message, $.scojs_message.TYPE_ERROR);
			}
		};


		EVENT.INIT = function() {

			/*提交按钮*/
			$("#changePwdBoxSubmit").click(function() {
				var oldPassword = $("#oldPassword").val();
                var newPassword = $("#newPassword").val();
                var newPassword2 = $("#newPassword2").val();

				if(_FUN.isNull(oldPassword)) {
                    FUN.ALERT("原密码不能为空",false);
					return;
				}
                if(_FUN.isNull(newPassword)) {
                    FUN.ALERT("新密码不能为空",false);
                    return;
                }
                if(newPassword.length <6){
                    FUN.ALERT("密码长度不能少于6位",false);
                    return;
                }
                if(newPassword != newPassword2){
                    FUN.ALERT("确认密码输入不一致",false);
                    return;
                }

                IMPL.CHANGE(oldPassword,newPassword,function(){
                    FUN.ALERT("修改密码成功",true);
                    setTimeout(function(){
                        FUN.ALERT("重新登录",false);
                        sessionStorage.removeItem("isLogin");
                        sessionStorage.removeItem("leftMainMenu");
                        location.href = "./login.html";
                    },2000)
                })
			});
		};
		FUN.INIT();
	};
	return controller;
});