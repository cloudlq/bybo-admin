define(['director', 'text!static/mainModuleConfig.json'], function(Router, routes) {

    routes = eval('(' + routes + ')');
    var currentController = null;

    //用于把字符串转化为一个函数，而这个也是路由的处理核心
    var routeHandler = function(config) {
        return function() {
            //页面是否需要登录，默认需要
            if (config["needLogin"] != "flase") {
                if (sessionStorage.getItem("isLogin") == null || sessionStorage.getItem("isLogin") == "undefined") {
                  location.href = "./login.html";
                  return;
                }
            }
            var params = Array.prototype.slice.call(arguments); //路由参数
            var template = config.template ? ("text!" + config.template) : "";
            require([template, config.controller], function(template, controller) {
                contentNode.html(template);
                if (currentController && currentController !== controller) {
                    currentController.onRouteChange && currentController.onRouteChange();
                }
                currentController = controller;
                controller.apply(null, params);
            })


        }
    };

    for (var key in routes) {
        routes[key] = routeHandler(routes[key]);
    }

    return Router.init(routes);
});
