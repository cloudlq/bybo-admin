define(function() {


    /*
     * 文件依赖
     */
    var config = {
        baseUrl: "./", //依赖相对路径
        paths: { //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
            director: 'libs/js/backbone-route',
            laytpl: 'libs/js/laytpl',
            text: 'libs/js/text', //用于requirejs导入html类型的依赖
            bootstrap: 'libs/js/bootstrap.min',
            jquery: 'libs/js/jquery.min',
            base: 'app/js/common/base',
            fun:"app/js/common/fun",
            ajaxfileupload:"libs/js/ajaxfileupload",
            
            //插件（plugins）
            iCheck: 'plugins/iCheck/icheck',
            message: 'plugins/terebentina-sco/js/sco.message',
            paginator: 'plugins/paginator/bootstrap-paginator',
            bootstrap_table: 'plugins/bootstrap-table/bootstrap-table',
            bootstrap_table_CN: 'plugins/bootstrap-table/bootstrap-table-zh-CN',
            table_export: 'plugins/bootstrap-table/tableExports',
            bootstrap_table_export: 'plugins/bootstrap-table/bootstrap-table-export',
            Chart: 'plugins/chartjs/Chart',
            moment: 'plugins/daterangepicker/moment',
            daterangepicker: 'plugins/daterangepicker/daterangepicker',
        	kindeditor:'plugins/kindeditor/kindeditor-min',
        	zh_CN:'plugins/kindeditor/zh_CN',
        	ckeditor:'plugins/ckeditor/ckeditor',
            viewer: 'plugins/viewer/viewer'
        	
        },
        shim: { //引入没有使用requirejs模块写法的类库。 
            bootstrap: ['jquery'],
            raphael: {
                deps: [],
                exports: 'Raphael'
            },
            base: ['bootstrap'],
            message: ['jquery'],
            fun:['jquery'],
            zh_CN:['kindeditor'],
            paginator: ['jquery'],
            bootstrap_table: ['bootstrap'],
            bootstrap_table_CN: ['bootstrap_table'],
            table_export:['jquery'],
            bootstrap_table_export:['table_export','bootstrap_table_CN'],
            daterangepicker: ['moment'],
            ajaxfileupload:['jquery']
        }

    };

    require.config(config);
    require(['jquery'], function($) {
        $(function($) {
            var modNam = $("#main").attr("data-moudle");
            if (modNam == "login") {
                require(['./app/js/common/server', './app/js/login']);
            } else {
                var win = window;
                win.$ = $; //暴露必要的全局变量，没必要拘泥于requirejs的强制模块化
                contentNode = $(".content-wrapper");
                require(['router', './app/js/common/_menu', './app/js/common/_header', './app/js/common/server', 'base','fun']);
            }

        });
    });

})
