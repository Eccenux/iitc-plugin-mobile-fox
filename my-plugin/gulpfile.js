var ms = require('gulp-monkeyscript');
var msProject = ms.createProject("monkeyscript.json");

var gulp = require('gulp');
var concat = require('gulp-concat');

/**
 * TODO: copy info from package to monkey script.
 * add update/download URL from package JSON?
 * make sure id.catory is supported.
 */
function packageToMonkey() {
}

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