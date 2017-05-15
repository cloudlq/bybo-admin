define(['text!../../tpl/_menu.html'], function(_mentTpl) {
    $("#_menu").html(_mentTpl);
    
    var menus = JSON.parse(sessionStorage.getItem("leftMainMenu"));
    var html ='<li class="header">菜单栏</li>';
    $.each(menus,function(i,item){
    	html += '<li><a>';
    	html += '<i class="fa  fa-cog"></i> <span>'+item.name+'</span>';
    	html += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i>';
    	html += '</span></a>';
    	html += '<ul class="treeview-menu">';
    	$.each(item.menuVos, function(i,cItem) {
    		html +='<li><a href="'+cItem.link+'"><i class="fa fa-circle-o"></i>'+cItem.name+'</a></li>';
    	});
    	html +='</ul></li>'
    });
    
    $("#leftMainMenu").html(html);
    $(window).on('hashchange', lightMenu);

    function lightMenu() {
        $(".sidebar-menu a").each(function(k, v) {
            if (location.href.indexOf($(v).attr("href")) > -1) {
                $('.sidebar-menu li').removeClass("active");
                $(v).parents('li').addClass("active");
            }
        });
    }

    lightMenu();
});
