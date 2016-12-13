import { NgModule } from '@angular/core';

import { MovableDirective } from './movable.directive';
import { MovableHandleDirective } from './movablehandle.directive';
export { MovableDirective, MovableHandleDirective };

@NgModule({
  declarations: [MovableDirective, MovableHandleDirective],
  exports: [MovableDirective, MovableHandleDirective]
})
export class MovableModule { }
