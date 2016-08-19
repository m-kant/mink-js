var gulp		= require('gulp');
var del			= require('del');
var newer		= require('gulp-newer');
var concat		= require('gulp-concat');
var less		= require('gulp-less');
var cleanCSS	= require('gulp-clean-css');
var autoprefixer= require('gulp-autoprefixer');
var uglify		= require('gulp-uglify');
var rename		= require('gulp-rename');

var jsFiles = [
	'src/js/mk.utils.js',
	'src/js/mk.utils.debug.js',
	'src/js/mk.utils.arrays.js',
	'src/js/mk.utils.objects.js',
	'src/js/mk.utils.dom.js',
	'src/js/mk.utils.helpers.js',
	'src/js/mk.utils.time.js',
	'src/js/mk.localizer.js',
	'src/js/mk.state.js',
	'src/js/mk.mixin.keep.js',
	'src/js/mk.mixin.events.js',
	'src/js/jquery.mk.cssanim.js',
	'src/js/jquery.mk.databridge.js',
	'src/js/jquery.mk.filter.js',
	'src/js/jquery.mk.lselect.js',
	'src/js/jquery.mk.modal.js',
	'src/js/jquery.mk.pagex.js',
	'src/js/mk.simplerender.js',
	'src/js/mk.drawer.js',
	'src/js/mk.slidemenu.js'
];

gulp.task('clean', function(){ return del('build/*'); });

gulp.task('js', function() {
	return gulp.src(jsFiles,{since:gulp.lastRun('js')})
		.pipe(newer('build/mk.js'))
		.pipe(concat('mk.js'))
		.pipe(gulp.dest('build/'))
		.pipe(rename('mk.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/'));
});

gulp.task('styles', function() {
	return gulp.src('src/less/mk.less',{since:gulp.lastRun('styles')})
		.pipe(newer({dest:'build/css/',extra:['./src/less/*.less','./src/less/**/*.less']}))
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gulp.dest('build/css/'))
		.pipe(rename('mk.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('build/css/'));
});

gulp.task('media', function() {
	return gulp.src('src/imgs/*.*',{since:gulp.lastRun('media')})
		.pipe(newer('build/imgs/'))
		.pipe(gulp.dest('build/imgs/'));
});


gulp.task('build', gulp.parallel( 'js', 'styles', 'media' ));
gulp.task('clean_build', gulp.series('clean','build'));
