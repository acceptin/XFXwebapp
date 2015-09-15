/**
 * 组件安装
 * npm install gulp-imagemin gulp-ruby-less gulp-minify-css gulp-htmlmin gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp    = require('gulp'),                          //基础库
    htmlmin = require('gulp-htmlmin'),                  //html压缩
    imagemin = require('gulp-imagemin'),                //图片压缩
    less = require('gulp-less'),          	            //less
    minifycss = require('gulp-minify-css'),             //css压缩
    jshint = require('gulp-jshint'),                    //js检查
    uglify  = require('gulp-uglify'),                   //js压缩
    rename = require('gulp-rename'),                    //重命名
    concat  = require('gulp-concat'),                   //合并文件
    clean = require('gulp-clean'),                      //清空文件夹
    tinylr = require('tiny-lr'),                        //livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');            //livereload

var imgSrc = './src/img/**/*',                          //图片路径
    imgDst = './dist/img',
    fontSrc = './bower_components/font-awesome/fonts/*',//字体路径
    fontDst = './dist/fonts/',
    jsSrc = ['./src/js/*.js','./src/js/vendor/*.js'],   //js路径
    jsDst = './dist/js',
    htmlSrc = './src/*.html',                           //html路径
    htmlDst = './dist/',
    cssSrc = './src/less/bootstrap.less',               //样式路径
    cssDst = './dist/css',
    tplSrc = './src/templets/*.htm',
    tplDst = './dist/templets';
//bower
var libSrc = [
    './bower_components/bootstrap/js/transition.js',
    './bower_components/bootstrap/js/dropdown.js',
    './bower_components/bootstrap/js/collapse.js',
    './bower_components/bootstrap/js/modal.js',
    './bower_components/bootstrap/js/tab.js',
    './bower_components/bootstrap/js/alert.js',
    './bower_components/jasny-bootstrap/js/offcanvas.js'
]
var libDst = './src/js/vendor';

// 字体处理
gulp.task('font',['clean-font'], function() {

    gulp.src(fontSrc)
      .pipe(gulp.dest(fontDst));
});
//清理字体
gulp.task('clean-font', function () {
  return gulp.src('./dist/fonts', {read: false})
    .pipe(clean());
});

// HTML处理
gulp.task('html', function() {
    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst));
});

// 样式处理
gulp.task('css', function () {
    gulp.src(cssSrc)
        .pipe(less())
        .pipe(gulp.dest(cssDst))
        .pipe(rename({basename:'xfx',suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', ['clean-img'], function(){
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})

//清理模版
gulp.task('clean-img', function () {
  return gulp.src('./dist/img', {read: false})
    .pipe(clean());
});

// js处理
gulp.task('js', ['movie-js'] ,  function () {
    
    gulp.src(jsSrc)
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

//将bower的库文件对应到指定位置
gulp.task('movie-js', ['clean-js'] ,  function () {
    return gulp.src(libSrc)
        .pipe(gulp.dest(libDst));
});

//清理js
gulp.task('clean-js', function () {
    return gulp.src(['./dist/js','./src/js/vendor'], {read: false})
        .pipe(clean());
});

// 模版文件HTML处理
gulp.task('tpl', ['clean-tpl'] ,function() {

    gulp.src(tplSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(tplDst));
});
//清理模版
gulp.task('clean-tpl', function () {
  return gulp.src('./dist/templets', {read: false})
    .pipe(clean());
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/images','./dist/css', './dist/js'])
        .pipe(clean({force: true}));
});


// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('font','html','css','images','js','tpl');
});


// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        // 监听html
        gulp.watch('./src/*.html', function(event){
            gulp.run('html');
        })

        // 监听css
        gulp.watch('./src/less/**/*.less', function(){
            gulp.run('css');
        });

        // 监听images
        gulp.watch('./src/img/*', function(){
            gulp.run('images');
        });

        // 监听js
        gulp.watch('./src/js/*.js', function(){
            gulp.run('js');
        });

        // 监听tpl
        gulp.watch('./src/templets/*.htm', function(){
            gulp.run('tpl');
        });

    });
});