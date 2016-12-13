import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
import * as merge from 'merge-stream';

import Config from '../../config';
import { TemplateLocalsBuilder } from '../../utils';

const plugins = <any>gulpLoadPlugins();

const INLINE_OPTIONS = {
  base: Config.TMP_DIR,
  target: 'es5',
  useRelativePaths: true,
  removeLineBreaks: true
};

export = () => {
  let tsProject = plugins.typescript.createProject(join(Config.TMP_DIR, Config.APP_PROJECTNAME), {
    typescript: require('typescript'),
    declaration: true
  });;
  let src = [
    join(Config.TMP_DIR, '**/*.ts')
  ];
  let result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
    .pipe(plugins.sourcemaps.init())
    .pipe(tsProject())
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });


  return merge(result.js
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(plugins.template(new TemplateLocalsBuilder().build())),
    result.dts
  )
    .pipe(gulp.dest(Config.TMP_DIR))
    .on('error', (e: any) => {
      console.log(e);
    });
};
