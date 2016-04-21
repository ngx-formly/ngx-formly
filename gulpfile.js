var gulp = require('gulp');

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

    var tsResult = gulp
        .src([PATHS.src, 'node_modules/angular2/typings/browser.d.ts', PATHS.demo])
        .pipe(typescript(tscConfig.compilerOptions));

    return tsResult.js.pipe(gulp.dest('dist'));
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

    gulp.src(PATHS.src)
        .pipe(tslint())
        .pipe(tslint.report("verbose"))

    gulp.src(PATHS.demo)
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
});

gulp.task('play', ['ts2js'], function () {
    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9000, app;

    gulp.watch(PATHS.src, ['ts2js']);

    app = connect().use(serveStatic(__dirname));
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port + '/demo');
    });
});

gulp.task('default', ['play']);
