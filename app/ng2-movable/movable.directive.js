"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var movablehandle_directive_1 = require('./movablehandle.directive');
;
var Position = (function () {
    function Position(pos) {
        this.height = null;
        this.width = null;
        if (this.containsNumberProp(pos, ['top', 'left'])) {
            this.top = pos.top;
            this.left = pos.left;
            if (this.containsNumberProp(pos, ['height', 'width'])) {
                this.height = pos.height;
                this.width = pos.width;
            }
        }
        else if (this.containsNumberProp(pos, ['clientY', 'clientX'])) {
            this.top = pos.clientY;
            this.left = pos.clientX;
        }
        else if (pos.changedTouches
            && pos.changedTouches.length > 0
            && pos.changedTouches[0]
            && this.containsNumberProp(pos.changedTouches[0], ['clientY', 'clientX'])) {
            this.top = pos.changedTouches[0].clientY;
            this.left = pos.changedTouches[0].clientX;
        }
    }
    Object.defineProperty(Position.prototype, "bottom", {
        get: function () {
            return (this.height === null) ? null : this.top + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "right", {
        get: function () {
            return (this.width === null) ? null : this.left + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Position.prototype.minus = function (position) {
        return new Position({
            top: (this.top - position.top),
            left: (this.left - position.left),
            height: this.height,
            width: this.width
        });
    };
    Position.prototype.plus = function (position) {
        return new Position({
            top: (this.top + position.top),
            left: (this.left + position.left),
            height: this.height,
            width: this.width
        });
    };
    Position.prototype.containsNumberProp = function (object, props) {
        return props.every(function (prop) { return prop in object && typeof object[prop] === 'number'; });
    };
    return Position;
}());
exports.Position = Position;
var MovableDirective = (function () {
    function MovableDirective(element, cd) {
        this.element = element;
        this.cd = cd;
        this.isMoving = false;
        this.isHandle = false;
        this.isMovable = true;
        this._movableEnabled = true;
        this.movableConstrained = true;
        this.handles = [];
    }
    Object.defineProperty(MovableDirective.prototype, "movableEnabled", {
        get: function () {
            return this._movableEnabled;
        },
        set: function (value) {
            this._movableEnabled = value;
            if (this.handles.length > 0) {
                this.handles.forEach(function (handle) { return handle.movableEnabled = value; });
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MovableDirective.prototype, "movable", {
        set: function (value) {
            this.movableName = value;
        },
        enumerable: true,
        configurable: true
    });
    MovableDirective.prototype.ngAfterViewInit = function () {
        var position = this.getStyle(this.element.nativeElement, 'position');
        if (position === 'static') {
            this.positionStyle = 'relative';
            this.cd.detectChanges();
        }
    };
    MovableDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.allHandles.changes.subscribe(function (handles) { return _this.updateQuery(handles); });
        this.updateQuery(this.allHandles);
    };
    MovableDirective.prototype.updateQuery = function (handles) {
        var _this = this;
        this.handles = handles.filter(function (handle) { return handle.movableHandle === _this.movableName; });
        if (this.handles.length === 0) {
            this.isHandle = true;
        }
        if (this.handles.length > 0) {
            this.handles.forEach(function (handle) { return handle.movableEnabled = _this.movableEnabled; });
        }
    };
    MovableDirective.prototype.onMouseDown = function (event) {
        this.startMoving(event);
    };
    MovableDirective.prototype.onMouseUp = function (event) {
        this.stopMoving();
    };
    MovableDirective.prototype.onMouseMove = function (event) {
        this.moveElement(event);
    };
    MovableDirective.prototype.onTouchStart = function (event) {
        this.startMoving(event);
    };
    MovableDirective.prototype.onTouchEnd = function (event) {
        this.stopMoving();
    };
    MovableDirective.prototype.onTouchMove = function (event) {
        this.moveElement(event);
    };
    MovableDirective.prototype.startMoving = function (event) {
        if (this.isEventInHandle(event) && this.movableEnabled) {
            this.startPosition = new Position(event).minus(this.getRelativeRect(this.element.nativeElement));
            this.isMoving = true;
            if (this.handles.length > 0) {
                this.handles.forEach(function (handle) { return handle.isMoving = true; });
            }
            this.cd.detectChanges();
        }
    };
    MovableDirective.prototype.stopMoving = function () {
        this.isMoving = false;
        if (this.handles.length > 0) {
            this.handles.forEach(function (handle) { return handle.isMoving = false; });
        }
        this.cd.detectChanges();
    };
    MovableDirective.prototype.moveElement = function (event) {
        if (this.isMoving) {
            var moved = false;
            var newPosition = new Position(event).minus(this.startPosition);
            if (!this.movableConstrained) {
                this.positionTop = newPosition.top;
                this.positionLeft = newPosition.left;
                moved = true;
            }
            else {
                var constainedByElement = this.element.nativeElement.ownerDocument.getElementById(this.movableConstraint);
                var constainedByAbsPos;
                if (constainedByElement) {
                    constainedByAbsPos = new Position(constainedByElement.getBoundingClientRect());
                }
                else {
                    constainedByAbsPos = this.getViewPos(this.element.nativeElement);
                }
                var elementAbsPos = new Position(this.element.nativeElement.getBoundingClientRect());
                var diffAbsToRel = elementAbsPos.minus(this.getRelativeRect(this.element.nativeElement));
                var newAbsPos = diffAbsToRel.plus(newPosition);
                if (newAbsPos.top >= constainedByAbsPos.top && newAbsPos.bottom <= constainedByAbsPos.bottom) {
                    this.positionTop = newPosition.top;
                    moved = true;
                }
                else {
                    if (newAbsPos.top < constainedByAbsPos.top) {
                        this.positionTop = constainedByAbsPos.minus(diffAbsToRel).top;
                        moved = true;
                    }
                    if (newAbsPos.bottom > constainedByAbsPos.bottom) {
                        this.positionTop = constainedByAbsPos.minus(diffAbsToRel).bottom - elementAbsPos.height;
                        moved = true;
                    }
                }
                if (newAbsPos.left >= constainedByAbsPos.left && newAbsPos.right <= constainedByAbsPos.right) {
                    this.positionLeft = newPosition.left;
                    moved = true;
                }
                else {
                    if (newAbsPos.left < constainedByAbsPos.left) {
                        this.positionLeft = constainedByAbsPos.minus(diffAbsToRel).left;
                        moved = true;
                    }
                    if (newAbsPos.right > constainedByAbsPos.right) {
                        this.positionLeft = constainedByAbsPos.minus(diffAbsToRel).right - elementAbsPos.width;
                        moved = true;
                    }
                }
            }
            if (moved) {
                event.preventDefault();
                event.stopPropagation();
                this.cd.detectChanges();
            }
        }
    };
    MovableDirective.prototype.isEventInHandle = function (event) {
        if (this.isHandle) {
            var srcElement = event.srcElement;
            while (srcElement !== this.element.nativeElement && srcElement.parentElement) {
                srcElement = srcElement.parentElement;
            }
            return this.element.nativeElement === srcElement;
        }
        else {
            return this.handles.some(function (handle) {
                var srcElement = event.srcElement;
                while (srcElement !== handle.element.nativeElement && srcElement.parentElement) {
                    srcElement = srcElement.parentElement;
                }
                return handle.element.nativeElement === srcElement;
            });
        }
    };
    MovableDirective.prototype.getRelativeRect = function (element) {
        return new Position({
            top: this.parseStyleInt(this.getStyle(element, 'top')) || 0,
            left: this.parseStyleInt(this.getStyle(element, 'left')) || 0,
            height: this.parseStyleInt(this.getStyle(element, 'height')) || 0,
            width: this.parseStyleInt(this.getStyle(element, 'width')) || 0
        });
    };
    MovableDirective.prototype.parseStyleInt = function (value) {
        return parseInt(value, 10);
    };
    MovableDirective.prototype.getStyle = function (element, property) {
        var view = this.getView(element);
        return view.getComputedStyle(element, null).getPropertyValue(property);
    };
    MovableDirective.prototype.getView = function (element) {
        var view = element.ownerDocument.defaultView;
        if (!view || view.opener) {
            view = window;
        }
        return view;
    };
    MovableDirective.prototype.getViewPos = function (element) {
        var view = this.getView(element);
        return new Position({
            top: 0,
            left: 0,
            height: view.innerHeight || element.ownerDocument.documentElement.clientHeight,
            width: view.innerWidth || element.ownerDocument.documentElement.clientWidth
        });
    };
    __decorate([
        core_1.HostBinding('class.movable-moving'), 
        __metadata('design:type', Object)
    ], MovableDirective.prototype, "isMoving", void 0);
    __decorate([
        core_1.HostBinding('class.movable-handle'), 
        __metadata('design:type', Object)
    ], MovableDirective.prototype, "isHandle", void 0);
    __decorate([
        core_1.HostBinding('style.position'), 
        __metadata('design:type', String)
    ], MovableDirective.prototype, "positionStyle", void 0);
    __decorate([
        core_1.HostBinding('style.top.px'), 
        __metadata('design:type', Number)
    ], MovableDirective.prototype, "positionTop", void 0);
    __decorate([
        core_1.HostBinding('style.left.px'), 
        __metadata('design:type', Number)
    ], MovableDirective.prototype, "positionLeft", void 0);
    __decorate([
        core_1.HostBinding('class.movable'), 
        __metadata('design:type', Boolean)
    ], MovableDirective.prototype, "isMovable", void 0);
    __decorate([
        core_1.HostBinding('class.movable-enabled'), 
        __metadata('design:type', Boolean)
    ], MovableDirective.prototype, "_movableEnabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MovableDirective.prototype, "movableEnabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], MovableDirective.prototype, "movable", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MovableDirective.prototype, "movableConstrained", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MovableDirective.prototype, "movableConstraint", void 0);
    __decorate([
        core_1.ContentChildren(movablehandle_directive_1.MovableHandleDirective, { descendants: true }), 
        __metadata('design:type', core_1.QueryList)
    ], MovableDirective.prototype, "allHandles", void 0);
    __decorate([
        core_1.HostListener('mousedown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [MouseEvent]), 
        __metadata('design:returntype', void 0)
    ], MovableDirective.prototype, "onMouseDown", null);
    __decorate([
        core_1.HostListener('document:mouseup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [MouseEvent]), 
        __metadata('design:returntype', void 0)
    ], MovableDirective.prototype, "onMouseUp", null);
    __decorate([
        core_1.HostListener('document:mousemove', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [MouseEvent]), 
        __metadata('design:returntype', void 0)
    ], MovableDirective.prototype, "onMouseMove", null);
    __decorate([
        core_1.HostListener('touchstart', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], MovableDirective.prototype, "onTouchStart", null);
    __decorate([
        core_1.HostListener('document:touchend', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], MovableDirective.prototype, "onTouchEnd", null);
    __decorate([
        core_1.HostListener('document:touchmove', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], MovableDirective.prototype, "onTouchMove", null);
    MovableDirective = __decorate([
        core_1.Directive({
            selector: '[movable]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.ChangeDetectorRef])
    ], MovableDirective);
    return MovableDirective;
}());
exports.MovableDirective = MovableDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9uZzItbW92YWJsZS9tb3ZhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBR08sZUFBZSxDQUFDLENBQUE7QUFDdkIsd0NBQXVDLDJCQUEyQixDQUFDLENBQUE7QUFPbEUsQ0FBQztBQUdGO0lBWUUsa0JBQVksR0FBYztRQVRuQixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBVyxJQUFJLENBQUM7UUFTMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsR0FBRyxHQUFTLEdBQUksQ0FBQyxHQUFHLENBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksR0FBUyxHQUFJLENBQUMsSUFBSSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxNQUFNLEdBQVMsR0FBSSxDQUFDLE1BQU0sQ0FBQztnQkFDaEMsSUFBSSxDQUFDLEtBQUssR0FBUyxHQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2hDLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLEdBQUcsR0FBUyxHQUFJLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLEdBQVMsR0FBSSxDQUFDLE9BQU8sQ0FBQztRQUNqQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFPLEdBQUksQ0FBQyxjQUFjO2VBQ3pC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LEVBQUU7OzttREFBQTtJQUtSO1FBQUMsWUFBSyxFQUFFOztnRUFBQTtJQUdSO1FBQUMsWUFBSyxFQUFFOzsrREFBQTtJQUdSO1FBQUMsc0JBQWUsQ0FBQyxnREFBc0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7d0RBQUE7SUFrQy9EO1FBQUMsbUJBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozt1REFBQTtJQUt0QztRQUFDLG1CQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7OztxREFBQTtJQU03QztRQUFDLG1CQUFZLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozt1REFBQTtJQUsvQztRQUFDLG1CQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7d0RBQUE7SUFLdkM7UUFBQyxtQkFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7c0RBQUE7SUFNOUM7UUFBQyxtQkFBWSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7dURBQUE7SUF6SGpEO1FBQUMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1NBQ3RCLENBQUM7O3dCQUFBO0lBd1JGLHVCQUFDO0FBQUQsQ0F2UkEsQUF1UkMsSUFBQTtBQXZSWSx3QkFBZ0IsbUJBdVI1QixDQUFBIiwiZmlsZSI6ImFwcC9uZzItbW92YWJsZS9tb3ZhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgSW5wdXQsIEhvc3RMaXN0ZW5lciwgSG9zdEJpbmRpbmcsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LFxuICBBZnRlclZpZXdJbml0LCBBZnRlckNvbnRlbnRJbml0LCBFbGVtZW50UmVmLCBDaGFuZ2VEZXRlY3RvclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1vdmFibGVIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL21vdmFibGVoYW5kbGUuZGlyZWN0aXZlJztcblxuZXhwb3J0IHR5cGUgQ29vcmRpbmF0ZXMgPSB7IHRvcDogbnVtYmVyLCBsZWZ0OiBudW1iZXIgfTtcbmV4cG9ydCB0eXBlIFJlY3RzID0geyB0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlciB9O1xuLy8gd29ya2Fyb3VuZCB0byBwcmV2ZW50IGVycm9yIGluIE1TIEVkZ2VcbmV4cG9ydCBpbnRlcmZhY2UgSVRvdWNoRXZlbnQgZXh0ZW5kcyBVSUV2ZW50IHtcbiAgY2hhbmdlZFRvdWNoZXM6IENvb3JkaW5hdGVzW107XG59O1xuZXhwb3J0IHR5cGUgUG9zaXRpb25zID0gQ29vcmRpbmF0ZXMgfCBSZWN0cyB8IElUb3VjaEV2ZW50IHwgTW91c2VFdmVudDtcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIHtcbiAgcHVibGljIHRvcDogbnVtYmVyO1xuICBwdWJsaWMgbGVmdDogbnVtYmVyO1xuICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuICBwdWJsaWMgd2lkdGg6IG51bWJlciA9IG51bGw7XG4gIHB1YmxpYyBnZXQgYm90dG9tKCkge1xuICAgIHJldHVybiAodGhpcy5oZWlnaHQgPT09IG51bGwpID8gbnVsbCA6IHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gIH1cbiAgcHVibGljIGdldCByaWdodCgpIHtcbiAgICByZXR1cm4gKHRoaXMud2lkdGggPT09IG51bGwpID8gbnVsbCA6IHRoaXMubGVmdCArIHRoaXMud2lkdGg7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwb3M6IFBvc2l0aW9ucykge1xuICAgIGlmICh0aGlzLmNvbnRhaW5zTnVtYmVyUHJvcChwb3MsIFsndG9wJywgJ2xlZnQnXSkpIHtcbiAgICAgIHRoaXMudG9wID0gKDxhbnk+cG9zKS50b3A7XG4gICAgICB0aGlzLmxlZnQgPSAoPGFueT5wb3MpLmxlZnQ7XG4gICAgICBpZiAodGhpcy5jb250YWluc051bWJlclByb3AocG9zLCBbJ2hlaWdodCcsICd3aWR0aCddKSkge1xuICAgICAgICB0aGlzLmhlaWdodCA9ICg8YW55PnBvcykuaGVpZ2h0O1xuICAgICAgICB0aGlzLndpZHRoID0gKDxhbnk+cG9zKS53aWR0aDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFpbnNOdW1iZXJQcm9wKHBvcywgWydjbGllbnRZJywgJ2NsaWVudFgnXSkpIHtcbiAgICAgIHRoaXMudG9wID0gKDxhbnk+cG9zKS5jbGllbnRZO1xuICAgICAgdGhpcy5sZWZ0ID0gKDxhbnk+cG9zKS5jbGllbnRYO1xuICAgIH0gZWxzZSBpZiAoKDxhbnk+cG9zKS5jaGFuZ2VkVG91Y2hlc1xuICAgICAgJiYgKDxhbnk+cG9zKS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPiAwXG4gICAgICAmJiAoPGFueT5wb3MpLmNoYW5nZWRUb3VjaGVzWzBdXG4gICAgICAmJiB0aGlzLmNvbnRhaW5zTnVtYmVyUHJvcCgoPGFueT5wb3MpLmNoYW5nZWRUb3VjaGVzWzBdLCBbJ2NsaWVudFknLCAnY2xpZW50WCddKVxuICAgICkge1xuICAgICAgdGhpcy50b3AgPSAoPGFueT5wb3MpLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICB0aGlzLmxlZnQgPSAoPGFueT5wb3MpLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHN1YnN0cmFjdCB0aGUgcG9zaXRpb24gYXJndW1lbnQgdG8gdGhlIGN1cnJlbnQgKHRvcCwgbGVmdCkgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIG5ldyBwb3NpdGlvbi5cbiAgICogQHBhcmFtICB7Q29vcmRpbmF0ZXN9IHBvc2l0aW9uICAgICBwb3NpdGlvbiB0byBzdWJzdHJhY3RcbiAgICogQHJldHVybiB7UG9zaXRpb259XG4gICAqL1xuICBwdWJsaWMgbWludXMocG9zaXRpb246IENvb3JkaW5hdGVzKTogUG9zaXRpb24ge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oe1xuICAgICAgdG9wOiAodGhpcy50b3AgLSBwb3NpdGlvbi50b3ApLFxuICAgICAgbGVmdDogKHRoaXMubGVmdCAtIHBvc2l0aW9uLmxlZnQpLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogYWRkIHRoZSBwb3NpdGlvbiBhcmd1bWVudCB0byB0aGUgY3VycmVudCAodG9wLCBsZWZ0KSBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgbmV3IHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gIHtDb29yZGluYXRlc30gcG9zaXRpb24gICAgIHBvc2l0aW9uIHRvIGFkZFxuICAgKiBAcmV0dXJuIHtQb3NpdGlvbn1cbiAgICovXG4gIHB1YmxpYyBwbHVzKHBvc2l0aW9uOiBDb29yZGluYXRlcyk6IFBvc2l0aW9uIHtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uKHtcbiAgICAgIHRvcDogKHRoaXMudG9wICsgcG9zaXRpb24udG9wKSxcbiAgICAgIGxlZnQ6ICh0aGlzLmxlZnQgKyBwb3NpdGlvbi5sZWZ0KSxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnRhaW5zTnVtYmVyUHJvcChvYmplY3Q6IGFueSwgcHJvcHM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHByb3BzLmV2ZXJ5KHByb3AgPT4gcHJvcCBpbiBvYmplY3QgJiYgdHlwZW9mIG9iamVjdFtwcm9wXSA9PT0gJ251bWJlcicpO1xuICB9XG59XG5cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21vdmFibGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBNb3ZhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgLyoqIHNhdmVkIHN0YXJ0IHBvc2l0aW9uIHdoZW4gbW92aW5nIHN0YXJ0cy4gKi9cbiAgcHJvdGVjdGVkIHN0YXJ0UG9zaXRpb246IFBvc2l0aW9uO1xuXG4gIC8qKiB0cnVlIGlmIG1vdmluZyBpcyBpbiBwcm9ncmVzcy4gKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb3ZhYmxlLW1vdmluZycpXG4gIHByb3RlY3RlZCBpc01vdmluZyA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MubW92YWJsZS1oYW5kbGUnKVxuICBwcm90ZWN0ZWQgaXNIYW5kbGUgPSBmYWxzZTtcblxuICAvKiogc2V0IHBvc2l0aW9uIHN0eWxlIG9uIGhvc3QgdG8gcmVsYXRpdmUuICovXG4gIEBIb3N0QmluZGluZygnc3R5bGUucG9zaXRpb24nKVxuICBwcm90ZWN0ZWQgcG9zaXRpb25TdHlsZTogc3RyaW5nO1xuXG4gIC8qKiBjdXJyZW50IFkgcG9zaXRpb24gb2YgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBASG9zdEJpbmRpbmcoJ3N0eWxlLnRvcC5weCcpXG4gIHB1YmxpYyBwb3NpdGlvblRvcDogbnVtYmVyO1xuXG4gIC8qKiBjdXJyZW50IFggcG9zaXRpb24gb2YgdGhlIG5hdGl2ZSBlbGVtZW50LiAqL1xuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQucHgnKVxuICBwcm90ZWN0ZWQgcG9zaXRpb25MZWZ0OiBudW1iZXI7XG5cbiAgLyoqIHNldCBjbGFzcyBvbiBob3N0IHRvIGluZGljYXRlIG1vdmFibGUgc3VwcG9ydC4gKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb3ZhYmxlJylcbiAgcHJvdGVjdGVkIGlzTW92YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIHNldCBjbGFzcyBkZXBlbmRpbmcgb24gdGhlIHN0YXR1cy4gKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb3ZhYmxlLWVuYWJsZWQnKVxuICBwcm90ZWN0ZWQgX21vdmFibGVFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIGdldCBtb3ZhYmxlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbW92YWJsZUVuYWJsZWQ7XG4gIH07XG5cbiAgLyoqIG9wdGlvbmFsIGlucHV0IHRvIHRvZ2dsZSBtb3ZhYmxlIHN0YXR1cy4gKi9cbiAgQElucHV0KClcbiAgcHJvdGVjdGVkIHNldCBtb3ZhYmxlRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX21vdmFibGVFbmFibGVkID0gdmFsdWU7XG4gICAgLy8gcHJvcGFnYXRlIGVuYWJsZWQgc3RhdHVzIHRvIGhhbmRsZXNcbiAgICBpZiAodGhpcy5oYW5kbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuaGFuZGxlcy5mb3JFYWNoKGhhbmRsZSA9PiBoYW5kbGUubW92YWJsZUVuYWJsZWQgPSB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG1vdmFibGVOYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHByb3RlY3RlZCBzZXQgbW92YWJsZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5tb3ZhYmxlTmFtZSA9IHZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1vdmFibGVDb25zdHJhaW5lZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1vdmFibGVDb25zdHJhaW50OiBzdHJpbmc7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNb3ZhYmxlSGFuZGxlRGlyZWN0aXZlLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gIHByb3RlY3RlZCBhbGxIYW5kbGVzOiBRdWVyeUxpc3Q8TW92YWJsZUhhbmRsZURpcmVjdGl2ZT47XG4gIHByb3RlY3RlZCBoYW5kbGVzOiBNb3ZhYmxlSGFuZGxlRGlyZWN0aXZlW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZiwgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZ2V0U3R5bGUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdwb3NpdGlvbicpO1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgIHRoaXMucG9zaXRpb25TdHlsZSA9ICdyZWxhdGl2ZSc7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5hbGxIYW5kbGVzLmNoYW5nZXMuc3Vic2NyaWJlKChoYW5kbGVzOiBRdWVyeUxpc3Q8TW92YWJsZUhhbmRsZURpcmVjdGl2ZT4pID0+IHRoaXMudXBkYXRlUXVlcnkoaGFuZGxlcykpO1xuICAgIC8vIFRPRE86IHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzEyODE4IGFuZCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy85Njg5XG4gICAgLy8gbWFudWFsbHkgdHJpZ2dlciBmaXJzdCB1cGRhdGUuXG4gICAgdGhpcy51cGRhdGVRdWVyeSh0aGlzLmFsbEhhbmRsZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVF1ZXJ5KGhhbmRsZXM6IFF1ZXJ5TGlzdDxNb3ZhYmxlSGFuZGxlRGlyZWN0aXZlPik6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlcyA9IGhhbmRsZXMuZmlsdGVyKGhhbmRsZSA9PiBoYW5kbGUubW92YWJsZUhhbmRsZSA9PT0gdGhpcy5tb3ZhYmxlTmFtZSk7XG4gICAgLy8gZmFsbGJhY2sgdG8gdGhpcyBhcyBoYW5kbGUgaWYgbm90IHNwZWNpZmllZFxuICAgIGlmICh0aGlzLmhhbmRsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmlzSGFuZGxlID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gcHJvcGFnYXRlIGVuYWJsZWQgc3RhdHVzIHRvIGhhbmRsZXNcbiAgICBpZiAodGhpcy5oYW5kbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuaGFuZGxlcy5mb3JFYWNoKGhhbmRsZSA9PiBoYW5kbGUubW92YWJsZUVuYWJsZWQgPSB0aGlzLm1vdmFibGVFbmFibGVkKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLnN0YXJ0TW92aW5nKGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5zdG9wTW92aW5nKCk7XG4gIH1cblxuICAvLyB1c2luZyBkb2N1bWVudCB0byBtb3ZlIGV2ZW4gcG9pbnRlciBsZWF2ZXMgdGhlIGhvc3QgKGZhc3QgbW92aW5nKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdmVFbGVtZW50KGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25Ub3VjaFN0YXJ0KGV2ZW50OiBJVG91Y2hFdmVudCkge1xuICAgIHRoaXMuc3RhcnRNb3ZpbmcoZXZlbnQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2hlbmQnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25Ub3VjaEVuZChldmVudDogSVRvdWNoRXZlbnQpIHtcbiAgICB0aGlzLnN0b3BNb3ZpbmcoKTtcbiAgfVxuXG4gIC8vIHVzaW5nIGRvY3VtZW50IHRvIG1vdmUgZXZlbiBwb2ludGVyIGxlYXZlcyB0aGUgaG9zdCAoZmFzdCBtb3ZpbmcpXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIHByb3RlY3RlZCBvblRvdWNoTW92ZShldmVudDogYW55KSB7XG4gICAgdGhpcy5tb3ZlRWxlbWVudChldmVudCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhcnRNb3ZpbmcoZXZlbnQ6IElUb3VjaEV2ZW50IHwgTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRXZlbnRJbkhhbmRsZShldmVudCkgJiYgdGhpcy5tb3ZhYmxlRW5hYmxlZCkge1xuICAgICAgdGhpcy5zdGFydFBvc2l0aW9uID0gbmV3IFBvc2l0aW9uKGV2ZW50KS5taW51cyh0aGlzLmdldFJlbGF0aXZlUmVjdCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCkpO1xuICAgICAgdGhpcy5pc01vdmluZyA9IHRydWU7XG4gICAgICBpZiAodGhpcy5oYW5kbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5oYW5kbGVzLmZvckVhY2goaGFuZGxlID0+IGhhbmRsZS5pc01vdmluZyA9IHRydWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHN0b3BNb3ZpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmhhbmRsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5oYW5kbGVzLmZvckVhY2goaGFuZGxlID0+IGhhbmRsZS5pc01vdmluZyA9IGZhbHNlKTtcbiAgICB9XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlIGhvc3QgcG9zaXRpb24gZm9yIHRoZSBzcGVjaWZpYyBldmVudCB3aGVuIG1vdmluZy5cbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlRWxlbWVudChldmVudDogSVRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgIHZhciBtb3ZlZCA9IGZhbHNlO1xuICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gbmV3IFBvc2l0aW9uKGV2ZW50KS5taW51cyh0aGlzLnN0YXJ0UG9zaXRpb24pO1xuICAgICAgaWYgKCF0aGlzLm1vdmFibGVDb25zdHJhaW5lZCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gbmV3UG9zaXRpb24udG9wO1xuICAgICAgICB0aGlzLnBvc2l0aW9uTGVmdCA9IG5ld1Bvc2l0aW9uLmxlZnQ7XG4gICAgICAgIG1vdmVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb25zdGFpbmVkQnlFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5tb3ZhYmxlQ29uc3RyYWludCk7XG4gICAgICAgIHZhciBjb25zdGFpbmVkQnlBYnNQb3M6IFBvc2l0aW9uO1xuICAgICAgICBpZiAoY29uc3RhaW5lZEJ5RWxlbWVudCkge1xuICAgICAgICAgIGNvbnN0YWluZWRCeUFic1BvcyA9IG5ldyBQb3NpdGlvbihjb25zdGFpbmVkQnlFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdGFpbmVkQnlBYnNQb3MgPSB0aGlzLmdldFZpZXdQb3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGVtZW50QWJzUG9zID0gbmV3IFBvc2l0aW9uKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgICAgdmFyIGRpZmZBYnNUb1JlbCA9IGVsZW1lbnRBYnNQb3MubWludXModGhpcy5nZXRSZWxhdGl2ZVJlY3QodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgICAgdmFyIG5ld0Fic1BvcyA9IGRpZmZBYnNUb1JlbC5wbHVzKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgaWYgKG5ld0Fic1Bvcy50b3AgPj0gY29uc3RhaW5lZEJ5QWJzUG9zLnRvcCAmJiBuZXdBYnNQb3MuYm90dG9tIDw9IGNvbnN0YWluZWRCeUFic1Bvcy5ib3R0b20pIHtcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gbmV3UG9zaXRpb24udG9wO1xuICAgICAgICAgIG1vdmVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobmV3QWJzUG9zLnRvcCA8IGNvbnN0YWluZWRCeUFic1Bvcy50b3ApIHtcbiAgICAgICAgICAgIC8vIG1heCB0byB0b3AgbGltaXQsIHRvIHByZXZlbnQgc3RpY2tpbmcgb2YgdGhlIG1vdmFibGUgb24gZmFzdCBtb3ZlXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gY29uc3RhaW5lZEJ5QWJzUG9zLm1pbnVzKGRpZmZBYnNUb1JlbCkudG9wO1xuICAgICAgICAgICAgbW92ZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3QWJzUG9zLmJvdHRvbSA+IGNvbnN0YWluZWRCeUFic1Bvcy5ib3R0b20pIHtcbiAgICAgICAgICAgIC8vIG1heCB0byBib3R0b20gbGltaXQsIHRvIHByZXZlbnQgc3RpY2tpbmcgb2YgdGhlIG1vdmFibGUgb24gZmFzdCBtb3ZlXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gY29uc3RhaW5lZEJ5QWJzUG9zLm1pbnVzKGRpZmZBYnNUb1JlbCkuYm90dG9tIC0gZWxlbWVudEFic1Bvcy5oZWlnaHQ7XG4gICAgICAgICAgICBtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdBYnNQb3MubGVmdCA+PSBjb25zdGFpbmVkQnlBYnNQb3MubGVmdCAmJiBuZXdBYnNQb3MucmlnaHQgPD0gY29uc3RhaW5lZEJ5QWJzUG9zLnJpZ2h0KSB7XG4gICAgICAgICAgdGhpcy5wb3NpdGlvbkxlZnQgPSBuZXdQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgIG1vdmVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobmV3QWJzUG9zLmxlZnQgPCBjb25zdGFpbmVkQnlBYnNQb3MubGVmdCkge1xuICAgICAgICAgICAgLy8gbWF4IHRvIGxlZnQgbGltaXQsIHRvIHByZXZlbnQgc3RpY2tpbmcgb2YgdGhlIG1vdmFibGUgb24gZmFzdCBtb3ZlXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uTGVmdCA9IGNvbnN0YWluZWRCeUFic1Bvcy5taW51cyhkaWZmQWJzVG9SZWwpLmxlZnQ7XG4gICAgICAgICAgICBtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChuZXdBYnNQb3MucmlnaHQgPiBjb25zdGFpbmVkQnlBYnNQb3MucmlnaHQpIHtcbiAgICAgICAgICAgIC8vIG1heCB0byByaWdodCBsaW1pdCwgdG8gcHJldmVudCBzdGlja2luZyBvZiB0aGUgbW92YWJsZSBvbiBmYXN0IG1vdmVcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25MZWZ0ID0gY29uc3RhaW5lZEJ5QWJzUG9zLm1pbnVzKGRpZmZBYnNUb1JlbCkucmlnaHQgLSBlbGVtZW50QWJzUG9zLndpZHRoO1xuICAgICAgICAgICAgbW92ZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vdmVkKSB7XG4gICAgICAgIC8vIHByZXZlbnQgc2VsZWN0aW9uIGFuZCBvdGhlciBzaWRlIGVmZmVjdHMgZHVyaW5nIG1vdmluZywgb25seSB3aGVuIHBvc2l0aW9uIG1vdmVkLCBpLmUuIHRvIGFsbG93IGJ1dHRvbnMgdG8gYmUgY2xpY2tlZFxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrcyBpZiB0aGUgZXZlbnQgb2NjdXJlZCBpbnNpZGUgdGhlIGhhbmRsZSBlbGVtZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGlzRXZlbnRJbkhhbmRsZShldmVudDogSVRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuaXNIYW5kbGUpIHtcbiAgICAgIHZhciBzcmNFbGVtZW50ID0gZXZlbnQuc3JjRWxlbWVudDtcbiAgICAgIC8vIGNoZWNrIHBhcmVudCBlbGVtZW50cyB0b28uXG4gICAgICB3aGlsZSAoc3JjRWxlbWVudCAhPT0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgJiYgc3JjRWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIHNyY0VsZW1lbnQgPSBzcmNFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgPT09IHNyY0VsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZXMuc29tZShoYW5kbGUgPT4ge1xuICAgICAgICB2YXIgc3JjRWxlbWVudCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIC8vIGNoZWNrIHBhcmVudCBlbGVtZW50cyB0b28uXG4gICAgICAgIHdoaWxlIChzcmNFbGVtZW50ICE9PSBoYW5kbGUuZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmIHNyY0VsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgIHNyY0VsZW1lbnQgPSBzcmNFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhbmRsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgPT09IHNyY0VsZW1lbnQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBlbGVtZW50J3MgcmVsYXRpdmUgcG9zaXRpb24uXG4gICAqIHNpbWlsYXIgdG8gdGhlIGFic29sdXRlIHBvc2l0aW9uIHdpdGggZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVsYXRpdmVSZWN0KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUG9zaXRpb24ge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oe1xuICAgICAgdG9wOiB0aGlzLnBhcnNlU3R5bGVJbnQodGhpcy5nZXRTdHlsZShlbGVtZW50LCAndG9wJykpIHx8IDAsXG4gICAgICBsZWZ0OiB0aGlzLnBhcnNlU3R5bGVJbnQodGhpcy5nZXRTdHlsZShlbGVtZW50LCAnbGVmdCcpKSB8fCAwLFxuICAgICAgaGVpZ2h0OiB0aGlzLnBhcnNlU3R5bGVJbnQodGhpcy5nZXRTdHlsZShlbGVtZW50LCAnaGVpZ2h0JykpIHx8IDAsXG4gICAgICB3aWR0aDogdGhpcy5wYXJzZVN0eWxlSW50KHRoaXMuZ2V0U3R5bGUoZWxlbWVudCwgJ3dpZHRoJykpIHx8IDBcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJzZSBpbnQuXG4gICAqL1xuICBwcm90ZWN0ZWQgcGFyc2VTdHlsZUludCh2YWx1ZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgY29tcHV0ZWQgc3R5bGUgcHJvcGVydHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0U3R5bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHByb3BlcnR5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhciB2aWV3ID0gdGhpcy5nZXRWaWV3KGVsZW1lbnQpO1xuICAgIHJldHVybiB2aWV3LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBlbGVtZW50J3Mgdmlld3BvcnQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VmlldyhlbGVtZW50OiBIVE1MRWxlbWVudCk6IFdpbmRvdyB7XG4gICAgdmFyIHZpZXcgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgaWYgKCF2aWV3IHx8IHZpZXcub3BlbmVyKSB7XG4gICAgICB2aWV3ID0gd2luZG93O1xuICAgIH1cbiAgICByZXR1cm4gdmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIGVsZW1lbnQncyB2aWV3cG9ydCBwb3NpdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWaWV3UG9zKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUG9zaXRpb24ge1xuICAgIHZhciB2aWV3ID0gdGhpcy5nZXRWaWV3KGVsZW1lbnQpO1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oe1xuICAgICAgdG9wOiAwLFxuICAgICAgbGVmdDogMCxcbiAgICAgIGhlaWdodDogdmlldy5pbm5lckhlaWdodCB8fCBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCxcbiAgICAgIHdpZHRoOiB2aWV3LmlubmVyV2lkdGggfHwgZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==
