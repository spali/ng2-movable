import * as gulp from 'gulp';
import { join } from 'path';
import { clean } from '../../utils';
import * as deploy from 'gulp-gh-pages';
import * as replace from 'gulp-replace';
import * as merge from 'merge-stream';

import Config from '../../config';

export = () => {
  clean(join(Config.DIST_DIR, '.publish'));
  return merge(
    gulp.src([
      join(Config.APP_DEST, '**/*'),
      '!' + join(Config.APP_DEST, '**/index.html')
    ]),
    gulp.src(join(Config.APP_DEST, '**/index.html'))
      .pipe(replace(/(href|src)="\/(.*)"/g, '$1="/ng2-movable/$2"'))
  )
    .pipe(deploy({ cacheDir: join(Config.DIST_DIR, '.publish') }));
};
