'use strict'

const gulp = require('gulp') /* Подключение gulp таск-раннера */
const sass = require('gulp-sass') /* Подключение SASS препроцессора */
const plumber = require('gulp-plumber') /* запирает все ошибки в себя, не останавливая работу скрипта */
const postcss = require('gulp-postcss') /* POSTCSS c автопрефикером */
const autoprefixer = require('autoprefixer') /* POSTCSS c автопрефикером */
const server = require('browser-sync').create() /* Модуль отображающий сайт в браузере */
const minify = require('gulp-csso') /* Минификация CSS */
const imagemin = require('gulp-imagemin') /* Оптимизация изображений */
const del = require('del') /* Модуль для удаления файлов */
const rename = require('gulp-rename') /* Отдельный плагин для переименования файла */
const posthtml = require('gulp-posthtml') /* POSTHTML для минификации HTML */
const include = require('posthtml-include') /* Плагин POSTHTML для вставки других файлов в HTML файлс помощью <include src=""></include> */
const strip = require('gulp-strip-comments') /* Вырезает комментарии */
const babel = require('gulp-babel') /* Поддержка старого кода JS*/
const terser = require('gulp-terser') /* Минификация JS*/
const svgstore = require('gulp-svgstore') /* Сборка SVG-спрайтов */
const pump = require('pump') /* Плагин Предотвращает ошибки в JS не останавливая работу скрипта */

gulp.task('clean', function () {
	return del('build')
})

gulp.task('copy', function () {
	return gulp
		.src(['source/fonts/**/*.{woff,woff2}', 'source/js/**', 'source/css/**'], {
			base: 'source',
		})
		.pipe(gulp.dest('build'))
})

gulp.task('style', function () {
	return gulp
		.src('source/sass/style.scss')
		.pipe(plumber())
		.pipe(
			sass({
				includePaths: ['source/sass/blocks'],
			})
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest('build/css'))
		.pipe(minify())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(server.stream())
})

gulp.task('images', function () {
	return gulp
		.src('source/img/**/*.{png,jpg,svg}')
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 3 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(gulp.dest('build/img'))
})

gulp.task('sprite', function () {
	return gulp
		.src('source/img/s-icon-*.svg')
		.pipe(
			svgstore({
				inlineSvg: true,
			})
		)
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('build/img'))
})

gulp.task('html', function () {
	return gulp
		.src('source/*.html')
		.pipe(posthtml([include()]))
		.pipe(strip.html())
		.pipe(gulp.dest('build'))
})

gulp.task('minJs', function (cb) {
	pump(
		[
			gulp.src('source/js/*.js'),
			babel(),
			terser(),
			rename({
				suffix: '.min',
			}),
			gulp.dest('build/js/'),
		],
		cb
	)
})

gulp.task('clean-images', function () {
	return del('build/img/**/*.{png,jpg,svg,webp}')
})

gulp.task('images-watch', gulp.series('clean-images', 'images', 'sprite'))
gulp.task(
	'build',
	gulp.series('clean', 'copy', 'style', 'images', 'sprite', 'html', 'minJs')
)

gulp.task('serve', function () {
	server.init({
		server: 'build/',
		notify: false,
		open: true,
		cors: true,
		ui: false,
	})

	gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('style'))
	gulp.watch('source/js/*.js', gulp.series('minJs')).on('change', server.reload)
	gulp.watch('source/*.html', gulp.series('html')).on('change', server.reload)
	gulp
		.watch('source/img/**/*.{png,jpg,svg,webp}', gulp.series('images-watch'))
		.on('all', server.reload)
})
