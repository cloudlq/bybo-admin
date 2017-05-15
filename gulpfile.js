var gulp = require('gulp');
var css = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var minifyHtml = require("gulp-minify-html");
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var requirejsOptimize = require('gulp-requirejs-optimize'); //require优化
var uglify = require('gulp-uglify');
var rename = require('gulp-rename'); //文件更名
var rename = require('gulp-concat'); //文件合并



var root = process.cwd();

function getMainModules() {
    //页面入口文件
    var mainModuleConfig = require('./static/mainModuleConfig.json');
    var modules = [];
    for (var i in mainModuleConfig) { //用javascript的for/in循环遍历对象的属性 
        modules.push(mainModuleConfig[i] + '.js');
    }
    console.log(modules);
    return modules;
}


gulp.task('server', function() {
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ];
    browserSync.init(files, {
        server: {
            baseDir: "./",
            index: "index.html"
        },
        port: 5555
    });
});

// 合并、压缩js文件
gulp.task('js', function() {
    return gulp.src('./*libs/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('../dist'));
});

gulp.task('rjs', function() {
    return gulp.src(getMainModules(), { base: './' })
        .pipe(requirejsOptimize({
            baseUrl: './',
            mainConfigFile: './main.js',
            optimize: 'uglify',
            exclude: [
                'jquery',
                'css'
            ]
        }))
        .pipe(gulp.dest('../dist'))
});

gulp.task('default', ['server']);

// gulp.task("mini-js", function() {
//     return gulp.src(['./*js/**/*.js', './*libs/*.js', './*libs/**/build/*.js', '*.js', '!gulpfile.js'])
//         .pipe(minify({
//             ext: {
//                 min: ".js",
//                 src: "-rog.js"
//             }
//         }))
//         .pipe(gulp.dest("dist"));
// })

// gulp.task('mini-css', function() {
//     return gulp.src('css/*.css')
//         .pipe(css())
//         .pipe(gulp.dest("dist/css"));
// });

// gulp.task('copy-html', function() {
//     gulp.src(['*.html', './*tpl/*.html']) // ÒªÑ¹ËõµÄhtmlÎÄ¼þ
//         .pipe(minifyHtml()) //Ñ¹Ëõ
//         .pipe(gulp.dest("dist"));
// });

// gulp.task('copy-img', function() {
//     return gulp.src('image/**')
//         .pipe(gulp.dest("dist/image"));
// });
// gulp.task('copy-other', function() {
//     return gulp.src(["./*json/*.json", "./*icons/**/*.*"])
//         .pipe(gulp.dest("dist"));
// });

// gulp.task('clean', function() {
//     return gulp.src(['dist/*'], {
//             read: false
//         })
//         .pipe(clean());
// });

// gulp.task('clean', function() {
//     return gulp.src(['dist/*'], {
//             read: false
//         })
//         .pipe(clean());
// });


// gulp.task('lint', function() {
//     return gulp.src(['js/**/*.js', '!js/*min.js'])
//         .pipe(jshint())
//         .pipe(jshint.reporter('jshint-stylish'));
// });

// gulp.task('watch', function() {
//     gulp.watch('js/**/*.js', ['lint']);
//     gulp.watch(['css/*.css', '*.html', 'tpl/*.html'], ['livereload']);

// });

// gulp.task('default', ['lint', 'watch', "server"]);

// gulp.task('build', ['mini-js', 'mini-css', 'copy-html', 'copy-img', 'copy-other']);
