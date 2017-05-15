define(['text!../../tpl/_header.html'], function(_headerTpl) {
    $("#_header").html(_headerTpl);
    $(".quit-admin").click(function() {
        sessionStorage.removeItem("isLogin");
        sessionStorage.removeItem("leftMainMenu");
        location.href = "./login.html";
    })
});
