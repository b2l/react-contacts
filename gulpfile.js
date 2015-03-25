var gulp = require('gulp'),
  babelify = require("babelify"),
  browserify = require('browserify'),
  watchify = require('watchify'),
  source = require('vinyl-source-stream'),
  reactify = require('reactify'),
  gutil = require('gulp-util'),
  webserver = require('gulp-webserver'),
  sourcemaps = require('gulp-sourcemaps'),
  buffer = require('vinyl-buffer');

var pkg = require('./package.json');

gulp.task('default', function() {
  gulp.start('compileJS', 'webserver');
});

gulp.task('compileJS', function() {
  return compileJS(true);
});

gulp.task('webserver', function() {
  gulp.src('public')
    .pipe(webserver({
      livereload: true
    }));
});

function compileJS(watch) {
  var bundler, rebundle;
  bundler = browserify('./src/js/app.js', {
    basedir: __dirname,
    debug: true,
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler)
  }

  bundler.transform(babelify);

  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', handleError('Browserify'));
    return stream.pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./public/js'));
  };

  bundler.on('update', rebundle);
  return rebundle();
}

function handleError(task) {
  return function(err) {
    gutil.log(gutil.colors.red(err));
  };
}
