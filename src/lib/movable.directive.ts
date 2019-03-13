import {
  Directive, Input, HostListener, ContentChildren, QueryList,
  AfterViewInit, AfterContentInit, ElementRef, ChangeDetectorRef, OnDestroy, RendererFactory2, Renderer2
} from '@angular/core';
import { MovableHandleDirective } from './movable-handle.directive';

export interface Coordinates {
  top: number;
  left: number;
}
export interface Rects {
  top: number;
  left: number;
  height: number;
  width: number;
}
// workaround to prevent error in MS Edge
export interface ITouchEvent extends UIEvent {
  changedTouches: Coordinates[];
}
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
  public minus(position: Coordinates) {
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
  public plus(position: Coordinates) {
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
export class MovableDirective implements AfterViewInit, AfterContentInit, OnDestroy {

  /** saved start position when moving starts. */
  protected startPosition: Position;


  /** true if moving is in progress. */
  private _isMoving: boolean;
  protected set isMoving(value: boolean) {
    this._isMoving = value;
    this.changeClass('movable-moving', value);
  }
  protected get isMoving() {
    return this._isMoving;
  }

  private _isHandle: boolean;
  protected set isHandle(value: boolean) {
    this._isHandle = true;
    this.changeClass('movable-handle', value);
  }
  protected get isHandle() {
    return this._isHandle;
  }

  /** set position style on host to relative. */
  protected set positionStyle(value: string) {
    this.setStyle('position', value);
  }

  /** current Y position of the native element. */
  protected set positionTop(value: number) {
    this.setStyle('top', value + 'px');
  }

  /** current X position of the native element. */
  protected set positionLeft(value: number) {
    this.setStyle('left', value + 'px');
  }

  /** set class on host to indicate movable support. */
  protected set isMovable(value: boolean) {
    this.changeClass('movable', value);
  }

  private _movableEnabled: boolean;
  /** set class depending on the status. */
  /** optional input to toggle movable status. */
  @Input()
  protected set movableEnabled(value: boolean) {
    this._movableEnabled = value;
    this.changeClass('movable-enabled', value);

    // propagate enabled status to handles
    if (this.handles.length > 0) {
      this.handles.forEach(handle => handle.movableEnabled = value);
    }
  }
  protected get movableEnabled() {
    return this._movableEnabled;
  }

  protected movableName: string;
  @Input()
  protected set movable(value: string) {
    this.movableName = value;
  }

  /** set a CSS selector to apply all movable logic to the child */
  @Input()
  public movableChildSelector: string;

  @Input()
  public movableConstrained = true;

  @Input()
  public movableConstraint: string;

  @ContentChildren(MovableHandleDirective, { descendants: true })
  protected allHandles: QueryList<MovableHandleDirective>;
  protected handles: MovableHandleDirective[] = [];

  protected listener1: () => void;
  protected listener2: () => void;

  private renderer: Renderer2;

  constructor(public element: ElementRef, protected cd: ChangeDetectorRef, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.isMoving = false;
    this.isHandle = false;
    this.isMovable = true;
    this.movableEnabled = true;
  }

  ngAfterViewInit() {

    // don't use our own host element, but a child of it
    if (this.movableChildSelector) {
      const childEl = this.element.nativeElement.querySelector(this.movableChildSelector);
      this.element = new ElementRef(childEl);
    }

    this.listener1 = this.renderer.listen(this.element.nativeElement, 'mousedown', e => this.startMoving(e));
    this.listener2 = this.renderer.listen(this.element.nativeElement, 'touchstart', e => this.startMoving(e));

    const position = this.getStyle(this.element.nativeElement, 'position');
    if (position === 'static') {
      this.positionStyle = 'relative';
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.listener1) { this.listener1(); }
    if (this.listener2) { this.listener2(); }
  }

  ngAfterContentInit() {
    this.allHandles.changes.subscribe((handles: QueryList<MovableHandleDirective>) => this.updateQuery(handles));
    // TODO: workaround for https://github.com/angular/angular/issues/12818 and https://github.com/angular/angular/issues/9689
    // manually trigger first update.
    this.updateQuery(this.allHandles);
  }

  protected updateQuery(handles: QueryList<MovableHandleDirective>) {
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

  @HostListener('document:mouseup', ['$event'])
  protected onMouseUp(event: MouseEvent) {
    this.stopMoving();
  }

  // using document to move even pointer leaves the host (fast moving)
  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent) {
    this.moveElement(event);
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

  protected startMoving(event: ITouchEvent | MouseEvent) {
    if (this.isEventInHandle(event) && this.movableEnabled) {
      this.startPosition = new Position(event).minus(this.getRelativeRect(this.element.nativeElement));
      this.isMoving = true;
      if (this.handles.length > 0) {
        this.handles.forEach(handle => handle.isMoving = true);
      }
      this.cd.detectChanges();
    }
  }

  protected stopMoving() {
    this.isMoving = false;
    if (this.handles.length > 0) {
      this.handles.forEach(handle => handle.isMoving = false);
    }
    this.cd.detectChanges();
  }

  /**
   * update host position for the specific event when moving.
   */
  protected moveElement(event: ITouchEvent | MouseEvent) {
    if (this.isMoving) {
      let moved = false;
      const newPosition = new Position(event).minus(this.startPosition);
      if (!this.movableConstrained) {
        this.positionTop = newPosition.top;
        this.positionLeft = newPosition.left;
        moved = true;
      } else {
        const constainedByElement: HTMLElement = this.element.nativeElement.ownerDocument.getElementById(this.movableConstraint);
        let constainedByAbsPos: Position;
        if (constainedByElement) {
          constainedByAbsPos = new Position(constainedByElement.getBoundingClientRect());
        } else {
          constainedByAbsPos = this.getViewPos(this.element.nativeElement);
        }
        const elementAbsPos = new Position(this.element.nativeElement.getBoundingClientRect());
        const diffAbsToRel = elementAbsPos.minus(this.getRelativeRect(this.element.nativeElement));
        const newAbsPos = diffAbsToRel.plus(newPosition);
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
    let srcElement = event.target || event.srcElement;
    if (this.isHandle) {
      // check parent elements too.
      while (srcElement instanceof HTMLElement && srcElement !== this.element.nativeElement && srcElement.parentElement) {
        srcElement = srcElement.parentElement;
      }
      return this.element.nativeElement === srcElement;
    } else {
      return this.handles.some(handle => {
        // check parent elements too.
        while (srcElement instanceof HTMLElement && srcElement !== handle.element.nativeElement && srcElement.parentElement) {
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
  protected parseStyleInt(value: string) {
    return parseInt(value, 10);
  }

  /**
   * get computed style property.
   */
  protected getStyle(element: HTMLElement, property: string) {
    const view = this.getView(element);
    return view.getComputedStyle(element, null).getPropertyValue(property);
  }

  /**
   * get the element's viewport.
   */
  protected getView(element: HTMLElement) {
    let view = element.ownerDocument.defaultView;
    if (!view || view.opener) {
      view = window;
    }
    return view;
  }

  /**
   * get the element's viewport position.
   */
  protected getViewPos(element: HTMLElement) {
    const view = this.getView(element);
    return new Position({
      top: 0,
      left: 0,
      height: view.innerHeight || element.ownerDocument.documentElement.clientHeight,
      width: view.innerWidth || element.ownerDocument.documentElement.clientWidth
    });
  }

  private changeClass(name: string, value: boolean) {
    if (value) {
      this.renderer.addClass(this.element.nativeElement, name);
    } else {
      this.renderer.removeClass(this.element.nativeElement, name);
    }
  }

  private setStyle(name: string, value: any) {
    this.renderer.setStyle(this.element.nativeElement, name, value);
  }
}
