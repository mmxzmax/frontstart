var gulp=require('gulp'),
    watch=require('gulp-watch'),
    preFixer=require('gulp-autoprefixer'),
    ugLify=require('gulp-uglify'),
    sass=require('gulp-sass'),
    sourceMaps=require('gulp-sourcemaps'),
    rigger=require('gulp-rigger'),
    cssMin=require('gulp-minify-css'),
    rimRaf=require('rimraf'),
    browserSync=require('browser-sync'),
    imagemin=require('gulp-imagemin'),
    pngcrush=require('imagemin-pngcrush'),
    reload=browserSync.reload;

var path={
    build:{
        html:'build',
        js:'build/js',
        css:'build/css',
        img:'build/img',
        fonts:'build/fonts'
    },
    src:{
        html:'src/*.html',
        js:'src/js/main.js',
        style:'src/css/main.sass',
        img:['src/img/**/*.jpg','src/img/**/*.png'],
        fonts:'src/fonts/**/*'
    },
    watch:{
        html:'src/**/*.html',
        js:'src/js/**/*.js',
        style:'src/css/**/*.sass',
        img:'src/img/**/*',
        fonts:'src/fonts/**/*'
    },
    clean:'build'

};
gulp.task('html:build',function(){
    "use strict";
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
});
gulp.task('js:build',function(){
    "use strict";
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourceMaps.init())
        .pipe(ugLify())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream:true}));
});

gulp.task('style:build',function(){
    "use strict";
    gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(sourceMaps.init())
        .pipe(preFixer())
        .pipe(cssMin())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream:true}));
});

gulp.task('copyimg',function(){
    "use strict";
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('copyfonts',function(){
    "use strict";
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('watch',function(){
    "use strict";
    watch([path.watch.js],function(ev,callback){
        gulp.start('js:build');
    });
    watch([path.watch.html],function(ev,callback){
        gulp.start('html:build');
    });
    watch([path.watch.style],function(ev,callback){
        gulp.start('style:build');
    });
    watch([path.watch.fonts],function(ev,callback){
        gulp.start('copyfonts');
    });
    watch([path.watch.img],function(ev,callback){
        gulp.start('copyimg');
    });
});
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: path.build.html
        }
    });
});
gulp.task('clean',function(){
    "use strict";
    rimRaf(path.clean,callback);
});
gulp.task('compress',function(){
    "use strict";
        gulp
        .src(path.src.img)
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]))
        .pipe( gulp.dest(path.build.img));
});



gulp.task('build',[
    'html:build',
    'js:build',
    'style:build',
    'copyfonts',
    'copyimg'
]);

gulp.task('default',['build','browser-sync','watch']);

gulp.task('build-dist',['build','compress']);