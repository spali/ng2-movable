import { Directive, HostBinding, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[movableHandle]'
})
export class MovableHandleDirective {

  @HostBinding('class.movable-enabled')
  public movableEnabled = false;

  @HostBinding('class.movable-handle')
  protected isHandle = true;

  @HostBinding('class.movable-moving')
  public isMoving = false;

  @Input()
  public movableHandle: string;

  constructor(public element: ElementRef) {
  }

}
