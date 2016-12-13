import { Directive, HostBinding, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[movableHandle]'
})
export class MovableHandleDirective {

  @HostBinding('class.movable-enabled')
  public movableEnabled: boolean = false;

  @HostBinding('class.movable-handle')
  protected isHandle: boolean = true;

  @HostBinding('class.movable-moving')
  public isMoving: boolean = false;

  @Input()
  public movableHandle: string;

  constructor(public element: ElementRef) {
  }

}
