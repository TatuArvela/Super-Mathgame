var gulp      = require('gulp');
var cordova   = require('cordova-lib').cordova;
var sass      = require('gulp-sass');
var ts        = require('gulp-typescript');

gulp.task('default', ['ts', 'sass', 'jquery']);

gulp.task('build', function (callback) {
  cordova.build({
    'platforms': ['android'],
    'options': {
      argv: ['--release','--gradleArg=--no-daemon']
    }
  }, callback);
});

gulp.task('sass', function() {
  gulp.src('./src/sass/index.sass')
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

gulp.task('jquery', function() {
  gulp.src('./node_modules/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./www/js'));
})