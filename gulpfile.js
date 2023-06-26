const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
// const rimraf = require('rimraf');

/* Server */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: 'build'
    }
  });
  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* Pug compile */
gulp.task('templates:compile', function() {
  return gulp.src('./source/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'));
});

/* Styles compile */
gulp.task('styles:compile', function() {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

/* Sprite */
gulp.task('sprite', function(cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.css'
  }));
  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

const rimraf = require('rimraf');


/* Clean */
gulp.task('clean', function(cb) {
  rimraf.sync('build'); // Use rimraf.sync for synchronous deletion
  cb();
});



/* Copy fonts */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* Copy images */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* Copy */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* Watchers */
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

/* Default task */
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
));
