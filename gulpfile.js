var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglifycss = require('gulp-uglifycss');
var jsonMinify = require('gulp-json-minify');


gulp.task('default', [
  'app-js',
  'app-html',
  'app-img',
  'app-css',
  'app-json',
  'vendor-js',
  'vendor-css',
  'vendor-font'
]);

gulp.task('app-js', function () {
  return gulp.src([
    'app/public/src/components/**/*.js',
    'app/public/src/app.js',
    'app/public/src/filters.js',
    'app/public/src/services/*.js'
  ])
  .pipe(concat('app.js'))
  .pipe(ngAnnotate())
  .pipe(gulp.dest('./app/public/dist'))
});

gulp.task('app-html', function () {
  return gulp.src([
    './app/public/src/components/**/*.html'
  ])
  .pipe(gulp.dest('./app/public/dist/components'))
});

gulp.task('app-img', function () {
  return gulp.src([
    './app/public/src/img/*'
  ])
  .pipe(gulp.dest('./app/public/dist/img'))
});

gulp.task('app-css', function () {
  return gulp.src([
    './app/public/src/css/*'
  ])
  .pipe(concat('app.css'))
  .pipe(uglifycss())
  .pipe(gulp.dest('./app/public/dist'))
});

gulp.task('app-json', function () {
  return gulp.src([
    './app/public/src/data/*'
  ])
  .pipe(jsonMinify())
  .pipe(gulp.dest('./app/public/dist/data'))
});


gulp.task('vendor-js', function () {
  return gulp.src([
    './app/public/src/bower_components/angular/angular.js',
    './app/public/src/bower_components/angular-route/angular-route.js',
    './app/public/src/bower_components/angular-resource/angular-resource.js',
    './app/public/src/bower_components/angular-aria/angular-aria.min.js',
    './app/public/src/bower_components/angular-sanitize/angular-sanitize.min.js',
    './app/public/src/bower_components/angular-animate/angular-animate.min.js',
    './app/public/src/bower_components/angular-material/angular-material.min.js',
    './app/public/src/bower_components/angular-material-data-table/dist/md-data-table.min.js',
    './app/public/src/bower_components/angular-data-grid/dist/dataGrid.min.js',
    './app/public/src/bower_components/angular-data-grid/dist/pagination.min.js',
    './app/public/src/bower_components/angular-qrcode/angular-qrcode.js',
    './app/public/src/bower_components/qrcode-generator/js/qrcode.js',
    './app/public/src/bower_components/bcryptjs/dist/bcrypt.min.js',
    './app/public/src/bower_components/crypto-js/crypto-js.js',
    './app/public/src/bower_components/openpgp/dist/openpgp.min.js',
    './app/public/src/bower_components/async/dist/async.min.js',
    './app/public/src/bower_components/ng-pdf-viewer/src/ng-pdf-viewer.min.js',
    './app/public/src/bower_components/pdfjs-dist/build/pdf.combined.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./app/public/dist'))
});

gulp.task('vendor-css', function () {
  return gulp.src([
    './app/public/src/bower_components/angular-material/angular-material.min.css',
    './app/public/src//bower_components/material-design-icons/iconfont/material-icons.css',
    './app/public/src/bower_components/angular-material-data-table/dist/md-data-table.min.css',
  ])
  .pipe(concat('vendor.css'))
  .pipe(uglifycss())
  .pipe(gulp.dest('./app/public/dist'))
});

gulp.task('vendor-font', function () {
  return gulp.src([
    './app/public/src/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
    './app/public/src/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff',
    './app/public/src/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf'
  ])
  .pipe(gulp.dest('./app/public/dist'))
});
