define(['message'], function() {
    var ROOT_PATH = location.protocol+"//"+location.host;
    var SERVER_NAME = "/bybo/";
    var func = $.ajax;
    $.ajax = function(option) {

        option.url = ROOT_PATH + SERVER_NAME + option.url;

        if (option.type.toLowerCase() == "post" && option.data != null && typeof option.data == "object") {
            option.data = JSON.stringify(option.data);
        }



        option.reqReferer = window.location.href;

        var sucFn = option.success;
        option.success = function(resp) {
            //判断是否是当页面的请求
            if (window.location.href == option.reqReferer) {
                if (resp.code == "0002") {
                    sessionStorage.removeItem("isLogin");
                    location.href = "./login.html";
                } else if (resp.code == "0000") {
                    sucFn(resp.returnValue);
                } else {
                    $.scojs_message(resp.message, $.scojs_message.TYPE_ERROR);
                }
            }

        };
        option.error = function() {
            $.scojs_message("系统异常");
        };
        $.extend(option, {
            contentType: "application/json",
            dataType: "json"
        });
        func(option);
    };
});
