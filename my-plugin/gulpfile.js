var ms = require('gulp-monkeyscript');
var msProject = ms.createFullProject("package.json");

var gulp = require('gulp');
var gulpless = require('gulp-less');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');

/**
 * LESS compile/merge task.
 * @param {Function} cb Some callback.
 */
function lessTask(cb) {
	
	gulp.src("src/less/index.less")
		.pipe(gulpless())
		.pipe(gulp.dest("src/css/"));
    
	cb();
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

// task names
exports.less = lessTask;
exports.build = buildTask;
exports.default = gulp.series(lessTask, buildTask)