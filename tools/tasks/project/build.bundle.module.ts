import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
import * as merge from 'merge-stream';
import * as jeditor from 'gulp-json-editor';
import * as Builder from 'systemjs-builder';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

const BUNDLER_OPTIONS = {
  format: 'umd',
  minify: true,
  mangle: false,
  sourceMaps: true
};
const SYSTEM_BUILDER_CONFIG: any = {
  defaultJSExtensions: true,
  base: Config.PROJECT_ROOT,
  paths: {
    [join(Config.TMP_DIR, '*')]: `${Config.TMP_DIR}/*`,
    'node_modules/*': 'node_modules/*',
    '*': 'node_modules/*'
  },
  // exclude dependencies
  meta: {
    '@angular/*': {
      build: false
    }
  },
  packages: {
    '@angular/core': {
      main: 'index.js',
      defaultExtension: 'js'
    }
  }
};

export = (done: any) => {
  let builder = new Builder(SYSTEM_BUILDER_CONFIG);
  builder
    .buildStatic(join(Config.TMP_DIR, 'index'),
    join(Config.MODULE_DEST, 'index.min.js'),
    BUNDLER_OPTIONS)
    .then(() => {
      return merge(
        bundleJS(),
        buildPackage()
      ).pipe(gulp.dest(Config.MODULE_DEST));
    })
    .catch((err: any) => done(err));
};

function bundleJS() {
  return gulp.src([
    join(Config.TMP_DIR, '**/*.d.ts'),
    join(Config.TMP_DIR, '**/*.js.map'),
    join(Config.TMP_DIR, '**/*.js')
  ]);
}

function buildPackage() {
  return merge(
    gulp.src([,
      join(Config.TMP_DIR, '**/README.md'),
      join(Config.TMP_DIR, '**/LICENSE')
    ]),
    gulp.src(join(Config.TMP_DIR, '**/package.json'))
      .pipe(jeditor(function(json: any) {
        delete json.scripts;
        delete json.devDependencies;
        return json;
      }))
  );
}
