const { src, dest, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const fileInclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-image');
const fs = require('fs');
const concat = require('gulp-concat');
const ttf2woff2 = require('gulp-ttf2woff2');

let isProd = false; // dev by default;

const clean = () => {
  return del(['app/*']);
};

const fonts = () => {
  return src('./src/resources/fonts/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts'));
};

const fontsStyle = (done) => {
  const cb = () => {};
  const srcFonts = './src/scss/_fonts.scss';
  const appFonts = './app/fonts/';

  const file_content = fs.readFileSync(srcFonts);
  fs.writeFile(srcFonts, '', cb);
  fs.readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (let i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(
            srcFonts,
            '@include font-face("' +
              fontname +
              '", "' +
              fontname +
              '", 400, "normal");\r\n',
            cb
          );
        }
        c_fontname = fontname;
      }
    }
  });

  done();
};

const svgSprites = () => {
  return src('./src/img/svg/**.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg', //sprite file name
          },
        },
      })
    )
    .pipe(dest('./app/img'));
};

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass().on('error', notify.onError()))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
};

const stylesBackend = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sass().on('error', notify.onError()))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(dest('./app/css/'));
};

const scripts = () => {
  src('./src/js/vendor/**.js')
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProd, uglify().on('error', notify.onError())))
    .pipe(dest('./app/js/'));
  return src([
    './src/js/global.js',
    './src/js/components/**.js',
    './src/js/main.js',
  ])
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('main.js'))
    .pipe(gulpif(isProd, uglify().on('error', notify.onError())))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
};

const scriptsBackend = () => {
  src('./src/js/vendor/**.js')
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProd, uglify().on('error', notify.onError())))
    .pipe(dest('./app/js/'));
  return src([
    './src/js/functions/**.js',
    './src/js/components/**.js',
    './src/js/main.js',
  ]).pipe(dest('./app/js'));
};

const resources = () => {
  return src(['./src/resources/**', '!./src/resources/fonts/*.ttf']).pipe(
    dest('./app')
  );
};

const images = () => {
  return src([
    './src/img/**.jpg',
    './src/img/**.png',
    './src/img/**.jpeg',
    './src/img/**.svg',
    './src/img/**/*.jpg',
    './src/img/**/*.png',
    './src/img/**/*.jpeg',
    './src/img/**/*.svg',
    '!./src/img/svg/*',
  ])
    .pipe(gulpif(isProd, image()))
    .pipe(dest('./app/img'));
};

const imagesGI = () => {
  return src([
    './src/img/**.gif',
    './src/img/**.ico',
    './src/img/**/*.gif',
    './src/img/**/*.ico',
  ]).pipe(dest('./app/img'));
};

const htmlInclude = () => {
  return src(['./src/*.html'])
    .pipe(
      fileInclude({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './app',
    },
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/partials/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/img/*.{jpg,jpeg,png,svg}', images);
  watch('./src/img/*.{gif,ico}', imagesGI);
  watch('./src/img/**/*.{jpg,jpeg,png}', images);
  watch('./src/img/**/*.{gif,ico}', imagesGI);
  watch('./src/img/svg/**.svg', svgSprites);
  watch('./src/resources/fonts/*.ttf', fonts);
};

const cache = () => {
  return src('app/**/*.{css,js,svg,png,jpg,jpeg}', {
    base: 'app',
  })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest('app'))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest('app'));
};

const rewrite = () => {
  const manifest = fs.readFileSync('app/rev.json');
  src('app/css/*.css')
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(dest('app/css'));
  return src('app/**/*.html')
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(dest('app'));
};

const htmlMinify = () => {
  return src('app/**/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('app'));
};

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(
  clean,
  htmlInclude,
  fonts,
  scripts,
  styles,
  resources,
  images,
  imagesGI,
  svgSprites,
  watchFiles
);

exports.build = series(
  toProd,
  clean,
  htmlInclude,
  fonts,
  scripts,
  styles,
  resources,
  images,
  imagesGI,
  svgSprites,
  htmlMinify
);

exports.cache = series(cache, rewrite);

exports.backend = series(
  toProd,
  clean,
  htmlInclude,
  fonts,
  scriptsBackend,
  stylesBackend,
  resources,
  images,
  imagesGI,
  svgSprites
);

exports.fonts = series(fonts, resources, fontsStyle);