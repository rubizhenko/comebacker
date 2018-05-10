'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require("css-mqpacker"),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    postcss = require('gulp-postcss'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    wait = require('gulp-wait'),
    browserSync = require("browser-sync"),
    svgSprite = require("gulp-svg-sprites"),
    svgo = require('gulp-svgo'),
    reload = browserSync.reload,
    spritesmith = require('gulp.spritesmith');


    var iconfont = require('gulp-iconfont');
    var iconfontCss = require('gulp-iconfont-css');

    const babel = require('gulp-babel');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        svg: 'build/img/svg',
        fonts: 'build/fonts/',
        video: 'build/video/',
    },
    deploy: { //Таск сборки проекта
        html: 'www/',
        js: 'www/js/',
        css: 'www/css/',
        img: 'www/img/',
        svg: 'www/img/svg',
        fonts: 'www/fonts/',
        video: 'www/video/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.sass',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        svg: 'src/svg/*.*',
        sprite: 'src/sprite/*.*',
        svgico: 'src/svgico/*.*',
        video: 'src/video/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.+(scss|sass)',
        img: 'src/img/**/*.*',
        sprite: 'src/sprite/*.*',
        svg: 'src/svg/*.*',
        svgico: 'src/svgico/*.*',
        video: 'src/video/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "terraleads"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html:deploy', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.deploy.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('js:deploy', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.deploy.js))
});

gulp.task('style:build', function () {
    var processors = [
        autoprefixer({browsers: ['last 10 versions'], cascade: false}),
        mqpacker({
            sort: function (a, b) {
                a = a.replace(/\D/g,'');
                b = b.replace(/\D/g,'');
                return b-a;
                // replace this with a-b for Mobile First approach
            }
        })
    ];
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('style:deploy', function () {
    var processors = [
        autoprefixer({browsers: ['last 10 versions'], cascade: false}),
        mqpacker({
            sort: function (a, b) {
                a = a.replace(/\D/g,'');
                b = b.replace(/\D/g,'');
                return b-a;
                // replace this with a-b for Mobile First approach
            }
        })
    ];
    gulp.src(path.src.style)
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(gulp.dest(path.deploy.css));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('sprite:build', function() {
    var spriteData = gulp.src(path.src.sprite)
    .pipe(spritesmith({
        imgName: 'icons.png',
        cssName: 'sprite.sass',
        imgPath: '../img/icons.png',
        cssFormat: 'sass',
        padding: 5
    }));
    spriteData.img
        .pipe(gulp.dest(path.build.img));
    spriteData.css
        .pipe(gulp.dest('src/style/libs/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('image:deploy', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.deploy.img));
});

gulp.task('svg:build', function () {
    return gulp.src(path.src.svg)
        .pipe(svgo())
        .pipe(svgSprite({
            selector: "svg-%f",
            cssFile: "../style/partials/sprite-svg.scss",
            svgPath: "../img/svg/sprite.svg",
            preview: false,
            padding: 10,
            templates: {
                scss: true
            }
        }))
        .pipe(gulp.dest('src/img'));
});

gulp.task('svg-ico:build', function () {
    return gulp.src(path.src.svgico)
        .pipe(svgo())
        .pipe(iconfontCss({
            fontName: 'fico', // required
            target: 'src/style/partials/font-icons.scss',
            targetPath: '../../style/partials/font-icons.scss',
            fontPath: '../fonts/icons/',
            cssClass: 'fico'
        }))
        .pipe(iconfont({
            fontName: 'fico', // required
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff','woff2', 'svg'], // default, 'woff2' and 'svg' are available
            normalize: true,
            fontHeight: 1001,
            fontStyle: 'normal',
            fontWeight: 'normal'
        }))
        .pipe(gulp.dest('src/fonts/icons'));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('fonts:deploy', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.deploy.fonts));
});


gulp.task('video:build', function () {
    gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video));
});

gulp.task('video:deploy', function () {
    gulp.src(path.src.video)
        .pipe(gulp.dest(path.deploy.video));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'video:build',
    'svg:build',
    'clean-fonts',
    'svg-ico:build',
    'image:build',
    'sprite:build',
    'fonts:build'
]);

gulp.task('deploy', [
    'html:deploy',
    'js:deploy',
    'style:deploy',
    'fonts:deploy',
    'video:deploy',
    'svg:build',    
    'svg:build',
    'svg-ico:build',
    'image:deploy'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.svg], function (event, cb) {
        gulp.start('svg:build');
    });
    watch([path.watch.svgico], function (event, cb) {
        gulp.start('svg-ico:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.sprite], function (event, cb) {
        gulp.start('sprite:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.video], function (event, cb) {
        gulp.start('video:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('clean-fonts', function (cb) {
    rimraf('build/fonts/icons/*.*', cb);
});


gulp.task('default', ['build', 'webserver', 'watch']);
