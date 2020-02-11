const gulp = require('gulp'),
      sass = require('gulp-sass'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      cssnano = require('cssnano')
      browserSync = require('browser-sync').create();

function scss() {
  return gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./scss/*.scss', scss);
  gulp.watch('./js/*.js').on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
}

exports.scss = scss;
exports.watch = watch;