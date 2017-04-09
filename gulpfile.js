var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  merge = require('merge-stream'),
  bower = require('main-bower-files');

var base = './src/';
var paths = {
  js: base + '**/*.js',
  css: base + '**/*.css',
  html: base + '**/!(index).html',
  index: base + 'index.html',
  dist: 'dist/',
  lib: 'dist/lib/'
};

var htmlminConfig = {
  collapseWhitespace: true,
  removeComments: true
};
var injectConfig = {
  addRootSlash: false,
  ignorePath: paths.dist
};

gulp.task('dist:js', function() {
  var js = gulp.src([base + 'app.js', base + '**/!(app).js']);

  var html = gulp.src(paths.html)
    .pipe($.htmlmin(htmlminConfig))
    .pipe($.angularTemplatecache({ module: 'metadata.editor' }));

  return merge(js, html)
    .pipe($.concat('metadata-editor.js'))
    .pipe($.ngAnnotate())
    .pipe($.insert.wrap('(function(){', '})();'))
    .pipe(gulp.dest(paths.dist))
    .pipe($.connect.reload());
});

gulp.task('dist:css', function() {
  return gulp.src(paths.css)
    .pipe($.concat('metadata-editor.css'))
    .pipe($.cssnano())
    .pipe(gulp.dest(paths.dist))
    .pipe($.connect.reload());
});

gulp.task('dist:lib', function() {
  return gulp.src(bower())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('dist:index', ['dist:js', 'dist:css', 'dist:lib'], function() {
  var sources = [
    paths.lib + 'jquery.min.js',
    paths.lib + 'bootstrap.min.js',
    paths.lib + 'bootstrap.min.css',
    paths.lib + 'angular.min.js',
    paths.lib + 'angular-route.min.js',
    paths.lib + 'ui-bootstrap-tpls.min.js',
    paths.lib + 'n3-browser.js',
    paths.lib + 'metadata-form.min.js',
    paths.lib + 'metadata-form.min.css',
    paths.dist + '*.js',
    paths.dist + '*.css'
  ];

  return gulp.src(paths.index)
    .pipe($.inject(gulp.src(sources, { read: false }), injectConfig))
    .pipe($.htmlmin(htmlminConfig))
    .pipe(gulp.dest(paths.dist))
    .pipe($.connect.reload());
});

gulp.task('dev:watch', function() {
  gulp.watch(paths.js, ['dist:js']);
  gulp.watch(paths.css, ['dist:css']);
  gulp.watch(paths.html, ['dist:js']);
  gulp.watch(paths.index, ['dist:index']);
});

gulp.task('dev:serve', function() {
  return $.connect.server({
    port: 9000,
    root: paths.dist,
    livereload: true
  });
});

gulp.task('dist', ['dist:index']);

gulp.task('dev', ['dist', 'dev:watch', 'dev:serve']);

gulp.task('default', ['dist']);