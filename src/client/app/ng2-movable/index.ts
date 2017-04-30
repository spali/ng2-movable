import { NgModule } from '@angular/core';

import { MovableDirective } from './movable.directive';
import { MovableHandleDirective } from './movablehandle.directive';
import { MovableBumperDirective } from './movablebumper.directive';
export { MovableDirective, MovableHandleDirective };

@NgModule({
  declarations: [MovableDirective, MovableBumperDirective, MovableHandleDirective],
  exports: [MovableDirective, MovableBumperDirective, MovableHandleDirective]
})
export class MovableModule { }
