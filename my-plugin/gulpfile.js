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
 * Main build task.
 * @param {Function} cb Some callback.
 */
function buildTask(cb) {
	// user.js
	gulp.src("src/**/*.js")
		.pipe(concat("mobile-fox.user.js"))
		.pipe(msProject.main()) // add monkeyscript header
		.pipe(gulp.dest("../"))
	;

	// meta.js
	var stream = source("mobile-fox.meta.js");
	stream.end('');
	stream
		.pipe(msProject.meta()) // add monkeyscript header
		.pipe(gulp.dest("../"))
	;
    
	cb();
}

/**
 * Watch-build.
 */
function watchTask() {
	gulp.watch(['src/less/*.less'], gulp.series(lessTask, buildTask));
	gulp.watch(['src/*.js'], buildTask);
}

// task names
exports.watch = watchTask;
exports.less = lessTask;
exports.build = buildTask;
exports.default = gulp.series(lessTask, buildTask)