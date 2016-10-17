var gulp = require('gulp');
var livereload = require('gulp-livereload');

var PATHS = {
  src: 'src/**/*.ts',
  demo: 'demo/**/*.ts'
};

gulp.task('clean', function (done) {
  var del = require('del');
  del(['dist'], done);
});

gulp.task('ts2js', function () {
  var typescript = require('gulp-typescript');
  var tscConfig = require('./tsconfig.json');
  tscConfig.compilerOptions.typescript = require('typescript');

  gulp.src([PATHS.src, PATHS.demo])
    .pipe(typescript(tscConfig.compilerOptions))
    .js.pipe(gulp.dest('src'))
    .pipe(livereload());
});

gulp.task('test', function (done) {
  var karmaServer = require('karma').Server;
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('tdd', function (done) {
  var karmaServer = require('karma').Server;
  new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task("tslint", function() {
  var tslint = require("gulp-tslint");

  gulp.src([PATHS.src, PATHS.demo])
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

gulp.task('default', ['test']);
