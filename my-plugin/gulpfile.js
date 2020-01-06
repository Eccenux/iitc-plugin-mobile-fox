var ms = require('gulp-monkeyscript');
var msProject = ms.createProject("package.json");

var gulp = require('gulp');
var concat = require('gulp-concat');

/**
 * Default gulp task.
 * @param {Function} cb Some callback.
 */
function defaultTask(cb) {
     
    gulp.src("src/**/*.js")
        .pipe(concat("script.user.js"))
        .pipe(msProject()) // append Tampermonkey header
        .pipe(gulp.dest("dist/"));
    
    
    cb();
}

exports.default = defaultTask