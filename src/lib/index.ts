import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovableDirective } from './movable.directive';
import { MovableHandleDirective } from './movable-handle.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MovableDirective, MovableHandleDirective],
  exports: [MovableDirective, MovableHandleDirective]
})
export class MovableModule {
  static forRoot() {
    return {
      ngModule: MovableModule,
      providers: []
    };
  }
}
