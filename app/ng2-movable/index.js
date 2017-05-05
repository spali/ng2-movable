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
var movable_directive_1 = require('./movable.directive');
exports.MovableDirective = movable_directive_1.MovableDirective;
var movablehandle_directive_1 = require('./movablehandle.directive');
exports.MovableHandleDirective = movablehandle_directive_1.MovableHandleDirective;
var MovableModule = (function () {
    function MovableModule() {
    }
    MovableModule = __decorate([
        core_1.NgModule({
            declarations: [movable_directive_1.MovableDirective, movablehandle_directive_1.MovableHandleDirective],
            exports: [movable_directive_1.MovableDirective, movablehandle_directive_1.MovableHandleDirective]
        }), 
        __metadata('design:paramtypes', [])
    ], MovableModule);
    return MovableModule;
}());
exports.MovableModule = MovableModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9uZzItbW92YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBRXpDLGtDQUFpQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRTlDLHdCQUFnQjtBQUR6Qix3Q0FBdUMsMkJBQTJCLENBQUMsQ0FBQTtBQUN4Qyw4QkFBc0I7QUFNakQ7SUFBQTtJQUE2QixDQUFDO0lBSjlCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFLENBQUMsb0NBQWdCLEVBQUUsZ0RBQXNCLENBQUM7WUFDeEQsT0FBTyxFQUFFLENBQUMsb0NBQWdCLEVBQUUsZ0RBQXNCLENBQUM7U0FDcEQsQ0FBQzs7cUJBQUE7SUFDMkIsb0JBQUM7QUFBRCxDQUE3QixBQUE4QixJQUFBO0FBQWpCLHFCQUFhLGdCQUFJLENBQUEiLCJmaWxlIjoiYXBwL25nMi1tb3ZhYmxlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTW92YWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vbW92YWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTW92YWJsZUhhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vbW92YWJsZWhhbmRsZS5kaXJlY3RpdmUnO1xuZXhwb3J0IHsgTW92YWJsZURpcmVjdGl2ZSwgTW92YWJsZUhhbmRsZURpcmVjdGl2ZSB9O1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtNb3ZhYmxlRGlyZWN0aXZlLCBNb3ZhYmxlSGFuZGxlRGlyZWN0aXZlXSxcbiAgZXhwb3J0czogW01vdmFibGVEaXJlY3RpdmUsIE1vdmFibGVIYW5kbGVEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIE1vdmFibGVNb2R1bGUgeyB9XG4iXX0=
