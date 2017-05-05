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
var MovableHandleDirective = (function () {
    function MovableHandleDirective(element) {
        this.element = element;
        this.movableEnabled = false;
        this.isHandle = true;
        this.isMoving = false;
    }
    __decorate([
        core_1.HostBinding('class.movable-enabled'), 
        __metadata('design:type', Boolean)
    ], MovableHandleDirective.prototype, "movableEnabled", void 0);
    __decorate([
        core_1.HostBinding('class.movable-handle'), 
        __metadata('design:type', Boolean)
    ], MovableHandleDirective.prototype, "isHandle", void 0);
    __decorate([
        core_1.HostBinding('class.movable-moving'), 
        __metadata('design:type', Boolean)
    ], MovableHandleDirective.prototype, "isMoving", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MovableHandleDirective.prototype, "movableHandle", void 0);
    MovableHandleDirective = __decorate([
        core_1.Directive({
            selector: '[movableHandle]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MovableHandleDirective);
    return MovableHandleDirective;
}());
exports.MovableHandleDirective = MovableHandleDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9uZzItbW92YWJsZS9tb3ZhYmxlaGFuZGxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBELGVBQWUsQ0FBQyxDQUFBO0FBSzFFO0lBY0UsZ0NBQW1CLE9BQW1CO1FBQW5CLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFYL0IsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFHN0IsYUFBUSxHQUFZLElBQUksQ0FBQztRQUc1QixhQUFRLEdBQVksS0FBSyxDQUFDO0lBTWpDLENBQUM7SUFiRDtRQUFDLGtCQUFXLENBQUMsdUJBQXVCLENBQUM7O2tFQUFBO0lBR3JDO1FBQUMsa0JBQVcsQ0FBQyxzQkFBc0IsQ0FBQzs7NERBQUE7SUFHcEM7UUFBQyxrQkFBVyxDQUFDLHNCQUFzQixDQUFDOzs0REFBQTtJQUdwQztRQUFDLFlBQUssRUFBRTs7aUVBQUE7SUFkVjtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsaUJBQWlCO1NBQzVCLENBQUM7OzhCQUFBO0lBa0JGLDZCQUFDO0FBQUQsQ0FqQkEsQUFpQkMsSUFBQTtBQWpCWSw4QkFBc0IseUJBaUJsQyxDQUFBIiwiZmlsZSI6ImFwcC9uZzItbW92YWJsZS9tb3ZhYmxlaGFuZGxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttb3ZhYmxlSGFuZGxlXSdcbn0pXG5leHBvcnQgY2xhc3MgTW92YWJsZUhhbmRsZURpcmVjdGl2ZSB7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb3ZhYmxlLWVuYWJsZWQnKVxuICBwdWJsaWMgbW92YWJsZUVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm1vdmFibGUtaGFuZGxlJylcbiAgcHJvdGVjdGVkIGlzSGFuZGxlOiBib29sZWFuID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm1vdmFibGUtbW92aW5nJylcbiAgcHVibGljIGlzTW92aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1vdmFibGVIYW5kbGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZikge1xuICB9XG5cbn1cbiJdfQ==
