import {
  Directive, Input, HostListener, HostBinding, ContentChildren, QueryList,
  AfterContentInit, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { MovableHandleDirective } from './movablehandle.directive';

// workaround to prevent error in MS Edge
type xTouchEvent = { changedTouches: { clientY: number, clientX: number }[], srcElement: Element };

type Coordinates = { clientY: number, clientX: number };
type Positions = Coordinates | MouseEvent | xTouchEvent;


export class Position {
  public clientY: number;
  public clientX: number;

  constructor(pos?: Positions) {
    if (pos instanceof MouseEvent) {
      this.clientY = pos.clientY;
      this.clientX = pos.clientX;
    } else if (pos
      && ((<Coordinates>pos).clientY || pos.hasOwnProperty('clientY'))
      && ((<Coordinates>pos).clientX) || pos.hasOwnProperty('clientX')) {
      this.clientY = (<Coordinates>pos).clientY;
      this.clientX = (<Coordinates>pos).clientX;
    } else if (pos
      && (<xTouchEvent>pos).changedTouches
      && (<xTouchEvent>pos).changedTouches.length > 0
      && (<xTouchEvent>pos).changedTouches[0]
      && (<xTouchEvent>pos).changedTouches[0].clientY
      && (<xTouchEvent>pos).changedTouches[0].clientX) {
      this.clientY = (<xTouchEvent>pos).changedTouches[0].clientY;
      this.clientX = (<xTouchEvent>pos).changedTouches[0].clientX;
    }
  }

  public minus(position: Position | Coordinates) {
    return new Position({ clientY: (this.clientY - position.clientY), clientX: (this.clientX - position.clientX) });
  }
}

@Directive({
  selector: '[movable]'
})
export class MovableDirective implements AfterContentInit {

  /** saved start position when moving starts. */
  protected startPosition: Position;

  /** true if moving is in progress. */
  @HostBinding('class.movable-moving')
  protected isMoving = false;

  @HostBinding('class.movable-handle')
  protected isHandle = false;

  /** set position style on host to relative. */
  @HostBinding('style.position')
  protected positionStyle: string = 'relative';

  /** current Y position of the native element. */
  @HostBinding('style.top.px')
  public positionTop: number;

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

  @ContentChildren(MovableHandleDirective, { descendants: true })
  protected allHandles: QueryList<MovableHandleDirective>;
  protected handles: MovableHandleDirective[] = [];

  constructor(public element: ElementRef, protected cd: ChangeDetectorRef) {
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

  @HostListener('mousedown', ['$event'])
  protected onMouseDown(event: MouseEvent) {
    this.startMoving(event);
  }

  @HostListener('document:mouseup')
  protected onMouseUp(event: MouseEvent) {
    this.stopMoving();
  }

  // using document to move even pointer leaves the host (fast moving)
  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent) {
    this.moveElement(event);
  }

  @HostListener('touchstart', ['$event'])
  protected onTouchStart(event: xTouchEvent) {
    this.startMoving(event);
  }

  @HostListener('document:touchend')
  protected onTouchEnd(event: xTouchEvent) {
    this.stopMoving();
  }

  // using document to move even pointer leaves the host (fast moving)
  @HostListener('document:touchmove', ['$event'])
  protected onTouchMove(event: xTouchEvent) {
    this.moveElement(event);
  }

  protected startMoving(event: xTouchEvent | MouseEvent) {
    if (this.isEventInHandle(event) && this.movableEnabled) {
      this.startPosition = new Position(event)
        .minus({ clientY: (this.positionTop || 0), clientX: (this.positionLeft || 0) });
      this.isMoving = true;
      if (this.handles.length > 0) {
        this.handles.forEach(handle => handle.isMoving = true);
      }
      this.cd.detectChanges(); // don't know why this is required, in some situations the HostBinding's don't work as expected.
    }
  }

  protected stopMoving() {
    this.isMoving = false;
    if (this.handles.length > 0) {
      this.handles.forEach(handle => handle.isMoving = false);
    }
    this.cd.detectChanges(); // don't know why this is required, in some situations the HostBinding's don't work as expected.
  }

  /**
   * update host position for the specific event when moving.
   */
  protected moveElement(event: xTouchEvent | MouseEvent) {
    if (this.isMoving) {
      var newPosition = new Position(event).minus(this.startPosition);
      this.positionTop = newPosition.clientY;
      this.positionLeft = newPosition.clientX;
    }
  }

  /**
   * checks if the event occured inside the handle element.
   */
  protected isEventInHandle(event: xTouchEvent | MouseEvent) {
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

}
