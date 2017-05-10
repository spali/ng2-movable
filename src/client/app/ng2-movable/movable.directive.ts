import {
  Directive, Input, HostListener, HostBinding, ContentChildren, QueryList,
  AfterViewInit, AfterContentInit, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { MovableHandleDirective } from './movablehandle.directive';

export type Coordinates = { top: number, left: number };
export type Rects = { top: number, left: number, height: number, width: number };
// workaround to prevent error in MS Edge
export interface ITouchEvent extends UIEvent {
  changedTouches: Coordinates[];
};
export type Positions = Coordinates | Rects | ITouchEvent | MouseEvent;

export class Position {
  public top: number;
  public left: number;
  public height: number = null;
  public width: number = null;
  public get bottom() {
    return (this.height === null) ? null : this.top + this.height;
  }
  public get right() {
    return (this.width === null) ? null : this.left + this.width;
  }

  constructor(pos: Positions) {
    if (this.containsNumberProp(pos, ['top', 'left'])) {
      this.top = (<any>pos).top;
      this.left = (<any>pos).left;
      if (this.containsNumberProp(pos, ['height', 'width'])) {
        this.height = (<any>pos).height;
        this.width = (<any>pos).width;
      }
    } else if (this.containsNumberProp(pos, ['clientY', 'clientX'])) {
      this.top = (<any>pos).clientY;
      this.left = (<any>pos).clientX;
    } else if ((<any>pos).changedTouches
      && (<any>pos).changedTouches.length > 0
      && (<any>pos).changedTouches[0]
      && this.containsNumberProp((<any>pos).changedTouches[0], ['clientY', 'clientX'])
    ) {
      this.top = (<any>pos).changedTouches[0].clientY;
      this.left = (<any>pos).changedTouches[0].clientX;
    }
  }

  /**
   * substract the position argument to the current (top, left) and return the result as new position.
   * @param  {Coordinates} position     position to substract
   * @return {Position}
   */
  public minus(position: Coordinates): Position {
    return new Position({
      top: (this.top - position.top),
      left: (this.left - position.left),
      height: this.height,
      width: this.width
    });
  }

  /**
   * add the position argument to the current (top, left) and return the result as new position.
   * @param  {Coordinates} position     position to add
   * @return {Position}
   */
  public plus(position: Coordinates): Position {
    return new Position({
      top: (this.top + position.top),
      left: (this.left + position.left),
      height: this.height,
      width: this.width
    });
  }

  protected containsNumberProp(object: any, props: string[]) {
    return props.every(prop => prop in object && typeof object[prop] === 'number');
  }
}


@Directive({
  selector: '[movable]'
})
export class MovableDirective implements AfterViewInit, AfterContentInit {

  /** saved start position when moving starts. */
  protected startPosition: Position;

  /** true if moving is in progress. */
  @HostBinding('class.movable-moving')
  protected isMoving = false;

  @HostBinding('class.movable-handle')
  protected isHandle = false;

  /** set position style on host to relative. */
  @HostBinding('style.position')
  protected positionStyle: string;

  /** current Y position of the native element. */
  @HostBinding('style.top.px')
  protected positionTop: number;

  /** current X position of the native element. */
  @HostBinding('style.left.px')
  protected positionLeft: number;

  /** set class on host to indicate movable support. */
  @HostBinding('class.movable')
  protected isMovable: boolean = true;

  /** set class depending on the status. */
  @HostBinding('class.movable-enabled')
  protected _movableEnabled: boolean = true;
  protected get movableEnabled(): boolean {
    return this._movableEnabled;
  };

  /** optional input to toggle movable status. */
  @Input()
  protected set movableEnabled(value: boolean) {
    this._movableEnabled = value;
    // propagate enabled status to handles
    if (this.handles.length > 0) {
      this.handles.forEach(handle => handle.movableEnabled = value);
    }
  }

  protected movableName: string;
  @Input()
  protected set movable(value: string) {
    this.movableName = value;
  }

  @Input()
  public movableConstrained: boolean = true;

  @Input()
  public movableConstraint: string;

  @ContentChildren(MovableHandleDirective, { descendants: true })
  protected allHandles: QueryList<MovableHandleDirective>;
  protected handles: MovableHandleDirective[] = [];

  constructor(public element: ElementRef, protected cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    var position = this.getStyle(this.element.nativeElement, 'position');
    if (position === 'static') {
      this.positionStyle = 'relative';
      this.cd.detectChanges();
    }
  }

  ngAfterContentInit() {
    this.allHandles.changes.subscribe((handles: QueryList<MovableHandleDirective>) => this.updateQuery(handles));
    // TODO: workaround for https://github.com/angular/angular/issues/12818 and https://github.com/angular/angular/issues/9689
    // manually trigger first update.
    this.updateQuery(this.allHandles);
  }

  protected updateQuery(handles: QueryList<MovableHandleDirective>): void {
    this.handles = handles.filter(handle => handle.movableHandle === this.movableName);
    // fallback to this as handle if not specified
    if (this.handles.length === 0) {
      this.isHandle = true;
    }
    // propagate enabled status to handles
    if (this.handles.length > 0) {
      this.handles.forEach(handle => handle.movableEnabled = this.movableEnabled);
    }
  }

  @HostListener('mousedown', ['$event'])
  protected onMouseDown(event: MouseEvent) {
    this.startMoving(event);
  }

  @HostListener('document:mouseup', ['$event'])
  protected onMouseUp(event: MouseEvent) {
    this.stopMoving();
  }

  // using document to move even pointer leaves the host (fast moving)
  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent) {
    this.moveElement(event);
  }

  @HostListener('touchstart', ['$event'])
  protected onTouchStart(event: ITouchEvent) {
    this.startMoving(event);
  }

  @HostListener('document:touchend', ['$event'])
  protected onTouchEnd(event: ITouchEvent) {
    this.stopMoving();
  }

  // using document to move even pointer leaves the host (fast moving)
  @HostListener('document:touchmove', ['$event'])
  protected onTouchMove(event: any) {
    this.moveElement(event);
  }

  protected startMoving(event: ITouchEvent | MouseEvent): void {
    if (this.isEventInHandle(event) && this.movableEnabled) {
      this.startPosition = new Position(event).minus(this.getRelativeRect(this.element.nativeElement));
      this.isMoving = true;
      if (this.handles.length > 0) {
        this.handles.forEach(handle => handle.isMoving = true);
      }
      this.cd.detectChanges();
    }
  }

  protected stopMoving(): void {
    this.isMoving = false;
    if (this.handles.length > 0) {
      this.handles.forEach(handle => handle.isMoving = false);
    }
    this.cd.detectChanges();
  }

  /**
   * update host position for the specific event when moving.
   */
  protected moveElement(event: ITouchEvent | MouseEvent): void {
    if (this.isMoving) {
      var moved = false;
      var newPosition = new Position(event).minus(this.startPosition);
      if (!this.movableConstrained) {
        this.positionTop = newPosition.top;
        this.positionLeft = newPosition.left;
        moved = true;
      } else {
        var constainedByElement: HTMLElement = this.element.nativeElement.ownerDocument.getElementById(this.movableConstraint);
        var constainedByAbsPos: Position;
        if (constainedByElement) {
          constainedByAbsPos = new Position(constainedByElement.getBoundingClientRect());
        } else {
          constainedByAbsPos = this.getViewPos(this.element.nativeElement);
        }
        var elementAbsPos = new Position(this.element.nativeElement.getBoundingClientRect());
        var diffAbsToRel = elementAbsPos.minus(this.getRelativeRect(this.element.nativeElement));
        var newAbsPos = diffAbsToRel.plus(newPosition);
        if (newAbsPos.top >= constainedByAbsPos.top && newAbsPos.bottom <= constainedByAbsPos.bottom) {
          this.positionTop = newPosition.top;
          moved = true;
        } else {
          if (newAbsPos.top < constainedByAbsPos.top) {
            // max to top limit, to prevent sticking of the movable on fast move
            this.positionTop = constainedByAbsPos.minus(diffAbsToRel).top;
            moved = true;
          }
          if (newAbsPos.bottom > constainedByAbsPos.bottom) {
            // max to bottom limit, to prevent sticking of the movable on fast move
            this.positionTop = constainedByAbsPos.minus(diffAbsToRel).bottom - elementAbsPos.height;
            moved = true;
          }
        }
        if (newAbsPos.left >= constainedByAbsPos.left && newAbsPos.right <= constainedByAbsPos.right) {
          this.positionLeft = newPosition.left;
          moved = true;
        } else {
          if (newAbsPos.left < constainedByAbsPos.left) {
            // max to left limit, to prevent sticking of the movable on fast move
            this.positionLeft = constainedByAbsPos.minus(diffAbsToRel).left;
            moved = true;
          }
          if (newAbsPos.right > constainedByAbsPos.right) {
            // max to right limit, to prevent sticking of the movable on fast move
            this.positionLeft = constainedByAbsPos.minus(diffAbsToRel).right - elementAbsPos.width;
            moved = true;
          }
        }
      }
      if (moved) {
        // prevent selection and other side effects during moving, only when position moved, i.e. to allow buttons to be clicked
        event.preventDefault();
        event.stopPropagation();
        this.cd.detectChanges();
      }
    }
  }

  /**
   * checks if the event occured inside the handle element.
   */
  protected isEventInHandle(event: ITouchEvent | MouseEvent): boolean {
    if (this.isHandle) {
      var srcElement = event.srcElement;
      // check parent elements too.
      while (srcElement !== this.element.nativeElement && srcElement.parentElement) {
        srcElement = srcElement.parentElement;
      }
      return this.element.nativeElement === srcElement;
    } else {
      return this.handles.some(handle => {
        var srcElement = event.srcElement;
        // check parent elements too.
        while (srcElement !== handle.element.nativeElement && srcElement.parentElement) {
          srcElement = srcElement.parentElement;
        }
        return handle.element.nativeElement === srcElement;
      });
    }
  }

  /**
   * get the element's relative position.
   * similar to the absolute position with getBoundingClientRect().
   */
  protected getRelativeRect(element: HTMLElement): Position {
    return new Position({
      top: this.parseStyleInt(this.getStyle(element, 'top')) || 0,
      left: this.parseStyleInt(this.getStyle(element, 'left')) || 0,
      height: this.parseStyleInt(this.getStyle(element, 'height')) || 0,
      width: this.parseStyleInt(this.getStyle(element, 'width')) || 0
    });
  }

  /**
   * parse int.
   */
  protected parseStyleInt(value: string): number {
    return parseInt(value, 10);
  }

  /**
   * get computed style property.
   */
  protected getStyle(element: HTMLElement, property: string): string {
    var view = this.getView(element);
    return view.getComputedStyle(element, null).getPropertyValue(property);
  }

  /**
   * get the element's viewport.
   */
  protected getView(element: HTMLElement): Window {
    var view = element.ownerDocument.defaultView;
    if (!view || view.opener) {
      view = window;
    }
    return view;
  }

  /**
   * get the element's viewport position.
   */
  protected getViewPos(element: HTMLElement): Position {
    var view = this.getView(element);
    return new Position({
      top: 0,
      left: 0,
      height: view.innerHeight || element.ownerDocument.documentElement.clientHeight,
      width: view.innerWidth || element.ownerDocument.documentElement.clientWidth
    });
  }

}
