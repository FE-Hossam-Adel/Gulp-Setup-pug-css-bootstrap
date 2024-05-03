import gulp  from 'gulp';
import pug  from 'gulp-pug';
import copy  from 'gulp-copy';
import concat  from 'gulp-concat';
import cleanCSS  from 'gulp-clean-css';
import webpackStream  from 'webpack-stream';
import webpackConfig  from './webpack.config.js';
import plumber  from 'gulp-plumber';
import livereload from 'gulp-livereload'
import uglify from 'gulp-uglify'
// Define a variable for your source and destination directories
const srcDir = 'src/';
const destDir = 'dist/';



gulp.task('pug', function() {
    return gulp.src(srcDir + 'pug/pages/*.pug')
      .pipe(pug({
        pretty: true // Optional: Beautify the output HTML
      }))
      .pipe(gulp.dest(destDir))
      .pipe(livereload())
});


// Define a task for copying Bootstrap and Font Awesome files
gulp.task('copy-assets', function() {
    return gulp.src([
        srcDir + '../node_modules/bootstrap/dist/css/bootstrap.min.css',
        srcDir + '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/css/all.min.css',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.ttf',
        srcDir + '../node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2',


      ])
      .pipe(copy(destDir, { prefix: 3 }))
      .pipe(livereload())

});

  gulp.task('css',async function() {
    const autoprefixer = await import('gulp-autoprefixer');
    return gulp.src([srcDir + 'css/main.css', srcDir + 'css/xs.css'])
      .pipe(concat('styles.bundle.css'))
      .pipe(autoprefixer.default({
        cascade: false
      }))
      .pipe(cleanCSS())
      .pipe(gulp.dest(destDir + 'css'))
      .pipe(livereload())

  });

  gulp.task('js', function() {
    return gulp.src('./src/js/index.js')
      .pipe(plumber())
      .pipe(webpackStream(webpackConfig))
      .pipe(gulp.dest('./dist/js'))
      .pipe(livereload())

  });

  


gulp.task('copy-images', ()=>{
    return gulp.src('src/images/*')
    .pipe(copy('dist/images', { prefix: 2 }))
    .pipe(livereload())

});

gulp.task('watch', function() {
    import('./server.js')
    livereload.listen()
    gulp.watch(srcDir + 'pug/**/*.pug', gulp.series('pug'));
    gulp.watch(srcDir + 'css/*.css', gulp.series('css'));
    gulp.watch(srcDir + 'js/**/*.js', gulp.series('js'));
    gulp.watch('src/images/*', gulp.series('copy-images'));
});