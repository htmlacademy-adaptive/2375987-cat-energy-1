import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
// мои пакеты

// минифицирую html
import htmlmin from 'gulp-htmlmin';
// минифицирую css
import csso from 'postcss-csso';
// минифицирую js
import terser from 'gulp-terser';
// переименование файлов
import rename from 'gulp-rename';
// оптимизирую растровые картинки, а потом изменяю формат изображения на wepb
import squoosh from 'gulp-libsquoosh';
// оптимизирую графику svg
import svgo from 'gulp-svgo';
// создаю стек
import {
  stacksvg
} from 'gulp-stacksvg';

//  плагин удаления файлов
import {
  deleteAsync
} from 'del';

import posthtml from 'gulp-posthtml';
import include from 'posthtml-include';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', {
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', {
      sourcemaps: '.'
    }))
    .pipe(browser.stream());
}

//HTML
const html = () => {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))

    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build/'))
}

// JS
const js = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js/'))
}


// optimizeImageS

const optimizeImageS = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

// copyImageS

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// WEBP

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

// Svg

const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/svg/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'))
}

//stacksvg
const createStack = () => {
  return gulp.src('source/img/svg/*.svg')
    .pipe(stacksvg())
    .pipe(gulp.dest('build/img'))
}
// copy fonts, favicon

const copy = (done) => {
  gulp.src(['source/fonts/**/*.{woff2,woff}',
      'source/*.ico',
      'source/*.webmanifest'
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build/'))
  done();
}

// Clean
const clean = () => {
  return deleteAsync('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(js));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// build

export const build = gulp.series(
  clean,
  copy,
  optimizeImageS,
  svg,
  gulp.parallel(
    styles,
    html,
    js,
    createStack,
    createWebp,
  )
);

// default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    js,
    svg,
    createStack,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
