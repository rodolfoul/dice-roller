var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');

gulp.task('clean:dist', function () {
	return del.sync('dist');
});

gulp.task('useref', function () {
	return gulp.src('src/gamebook/*.html')
		.pipe(useref())
		// .pipe(gulpIf('*.js', uglify())) //Uglify cannot process ES6 syntax
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'src'
		},
	})
});

gulp.task('watch', ['browserSync'], function () {
	// Reloads the browser whenever HTML or JS files change
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/**/*.js', browserSync.reload);
	gulp.watch('src/**/*.css', browserSync.reload);
	gulp.watch('src/**/*.html', browserSync.reload);
});