var gulp      = require('gulp');
var sass      = require('gulp-sass');
var ts        = require('gulp-typescript');

gulp.task('default', ['ts', 'sass']);

gulp.task('sass', function() {
  return gulp.src('./src/sass/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./www/css'));
});

gulp.task('ts', function() {
  gulp.src('./src/ts/*.ts')
  .pipe(ts({
    noImplicitAny: true,
    target: "es5"
  }))
  .pipe(gulp.dest('./www/js'));
});