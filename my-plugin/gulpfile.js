var ms = require('gulp-monkeyscript');
var msProject = ms.createFullProject("package.json");

var gulp = require('gulp');
var gulpless = require('gulp-less');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');

/**
 * LESS compile/merge task.
 */
function lessTask() {
	return gulp.src("src/less/index.less")
		.pipe(gulpless())
		.pipe(gulp.dest("src/css/"));
}

/**
 * Build user.js.
 */
function buildMainTask() {
	return gulp.src("src/**/*.js")
		.pipe(concat("mobile-fox.user.js"))
		.pipe(msProject.main()) // add monkeyscript header
		.pipe(gulp.dest("../"))
	;
}
/**
 * Build meta.js.
 */
function buildMetaTask() {
	var stream = source("mobile-fox.meta.js");
	stream.end('');
	return stream
		.pipe(msProject.meta()) // add monkeyscript header
		.pipe(gulp.dest("../"))
	;
}

/**
 * Main build task.
 */
var buildTask = gulp.parallel(buildMainTask, buildMetaTask);

/**
 * Watch-build.
 */
function watchTask() {
	gulp.watch(['src/less/*.less'], gulp.series(lessTask, buildTask));
	gulp.watch(['src/*.js'], buildMainTask);
}

// task names
exports.watch = watchTask;
exports.less = lessTask;
exports.build = buildTask;
exports.buildMain = buildMainTask;
exports.buildMeta = buildMetaTask;
exports.default = gulp.series(lessTask, buildTask)