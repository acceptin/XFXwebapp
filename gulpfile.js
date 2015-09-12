/**
 * 组件安装
 * npm install gulp-imagemin gulp-ruby-less gulp-minify-css gulp-htmlmin gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    htmlmin = require('gulp-htmlmin'),         //html压缩
    imagemin = require('gulp-imagemin'),       //图片压缩
    less = require('gulp-less'),          	   //less
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');   //livereload

// 字体处理
gulp.task('font', function() {
    var fontSrc = './bower_components/font-awesome/fonts/*',
        fontDst = './dist/fonts/';

    gulp.src(fontSrc)
      .pipe(gulp.dest(fontDst));
});

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst));
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './src/less/bootstrap.less',
        cssDst = './dist/css';

    gulp.src(cssSrc)
        .pipe(less({ style: 'expanded'}))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = './src/img/**/*',
        imgDst = './dist/img';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})

// js处理
gulp.task('js', function () {
    var jsSrc = './src/js/**/*.js',
        jsDst = './dist/js';
    //将bower的库文件对应到指定位置
    gulp.src('./bower_components/bootstrap/js/transition.js')
      .pipe(gulp.dest('./src/js/vendor'));

	gulp.src('./bower_components/bootstrap/js/dropdown.js')
      .pipe(gulp.dest('./src/js/vendor'));

	gulp.src('./bower_components/bootstrap/js/collapse.js')
      .pipe(gulp.dest('./src/js/vendor'));

	gulp.src('./bower_components/bootstrap/js/modal.js')
      .pipe(gulp.dest('./src/js/vendor'));

	gulp.src('./bower_components/bootstrap/js/tab.js')
      .pipe(gulp.dest('./src/js/vendor'));

	gulp.src('./bower_components/bootstrap/js/alert.js')
      .pipe(gulp.dest('./src/js/vendor'));

	gulp.src('./bower_components/jasny-bootstrap/js/offcanvas.js')
      .pipe(gulp.dest('./src/js/vendor'));

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

// 模版文件HTML处理
gulp.task('tpl', function() {
    var tplSrc = './src/templets/*.htm',
        tplDst = './dist/templets';

    gulp.src(tplSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(tplDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/css', './dist/js', './dist/images', './dist/templets'], {read: false})
        .pipe(clean({focus:true}));
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
        gulp.watch('./src/less/*.less', function(){
            gulp.run('css');
        });

        // 监听images
        gulp.watch('./src/img/**/*', function(){
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