/* global exports */
var ms = require('gulp-monkeyscript');
var msProject = ms.createProject("monkeyscript.json");

var gulp = require('gulp');
var concat = require('gulp-concat');

/**
 * Default gulp task.
 * @param {Function} cb Some callback.
 */
function defaultTask(cb) {
     
    gulp.src("src/**/*.js")
        .pipe(concat("script.user.js"))
        .pipe(msProject())
        .pipe(gulp.dest("dist/"));
    
    
    cb();
}

exports.default = defaultTask