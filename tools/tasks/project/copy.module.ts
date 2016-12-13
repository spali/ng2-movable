import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

export = () => {
  return gulp.src([
    join(Config.MODULE_SRC, '**/*.ts'),
    join(Config.APP_SRC, '**/*.json'),
    join(Config.PROJECT_ROOT, 'package.json'),
    join(Config.PROJECT_ROOT, 'README.md'),
    join(Config.PROJECT_ROOT, 'LICENSE'),
    '!' + join(Config.MODULE_SRC, '**/*.spec.ts'),
    '!' + join(Config.MODULE_SRC, '**/*.e2e-spec.ts')
  ])
    .pipe(gulp.dest(Config.TMP_DIR));
};
