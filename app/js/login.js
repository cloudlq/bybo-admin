define(['fun'], function() {

	var acctObj = {
		el: $("#login-name"),
		validate: function() {
			if(this.el.val() == "") {
				errorInput(this.el, "账号不能为空！");
				return false;
			}

			if(this.el.val().length > 11) {
				errorInput(this.el, "账号最长11位！");
				return false;
			}

			return true;
		}
	};

	var passwordObj = {
		el: $("#password"),
		validate: function() {
			if(this.el.val() == "") {
				errorInput(this.el, "密码不能为空！");
				return false;
			}

			if(this.el.val().length > 11) {
				errorInput(this.el, "账号最长11位！");
				return false;
			}

			return true;
		}
	};

	$("#login").click(function() {
		if(!acctObj.validate()) {
			return false;
		}
		if(!passwordObj.validate()) {
			return false;
		}

		$.ajax({
			url: 'login?username=' + acctObj.el.val() + '&password=' + passwordObj.el.val(),
			type: "POST",
			data: JSON.stringify({}),
			contentType: "application/json",
			dataType: "json",
			success: function() {
				sessionStorage.setItem("isLogin", "isLogin");

				$.ajax({
					url: 'admin/getMenus',
					type: "GET",
					contentType: "application/json",
					dataType: "json",
					success: function(resp) {
						sessionStorage.setItem("leftMainMenu",JSON.stringify(resp));
						location.href = './index.html';
					}
				});

			}
		});

	});

	function errorInput($node, msg) {
		$node.parent(".form-group").addClass("has-error");
		$node.siblings(".help-block").show().children(".error-input").text(msg);
		$node.one("focus", function() {
			$(this).parent(".form-group").removeClass("has-error");
			$(this).siblings(".help-block").hide();
		})
	}
});