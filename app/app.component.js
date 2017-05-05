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
var platform_browser_1 = require('@angular/platform-browser');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var hljs = require('highlight.js');
var index_1 = require('./ng2-movable/index');
var AppComponent = (function () {
    function AppComponent(vcRef, compiler) {
        this.vcRef = vcRef;
        this.compiler = compiler;
        this.templates = [
            {
                title: 'Simple example',
                code: "<div movable [movableEnabled]=\"toggle\">\n  <div><b>Simple movable</b></div>\n  The complete element can be used for moving.<br />\n  <button (click)=\"toggle = !toggle\">toggle enabled state</button>\n</div>"
            },
            {
                title: 'Handle Example',
                code: "<div movable [movableEnabled]=\"toggle\">\n  <div movableHandle><b>Movable with handle</b></div>\n  Only the handle element can be used for moving.<br />\n  <button (click)=\"toggle = !toggle\">toggle enabled state</button>\n</div>"
            },
            {
                title: 'Handle Example 2',
                code: "<div movable [movableEnabled]=\"toggle\">\n  <div movableHandle><b>Movable with handle</b></div>\n  <div movable=\"handle2\"><div movableHandle=\"handle2\">another handle</div>another movable</div>\n  Only the handle element can be used for moving.<br />\n  <button (click)=\"toggle = !toggle\">toggle enabled state</button>\n</div>"
            },
            {
                title: 'Relativ start position Example',
                code: "<div class=\"relativpos\" movable [movableEnabled]=\"toggle\">\n  <div><b>Simple movable with relativ start position by class</b></div>\n  The complete element can be used for moving.<br />\n  <button (click)=\"toggle = !toggle\">toggle enabled state</button>\n</div>"
            },
            {
                title: 'Constrained example',
                code: "<div style=\"border: 0.2em dotted red; height: 100px; width: 500px;\" id=\"constrainedByElement\">\n  <div movable [movableEnabled]=\"toggle\" movableConstraint=\"constrainedByElement\">\n    <div><b>Movable constrained to an element</b></div>\n    This movable won't left the constrained element.\n  </div>\n</div>"
            },
            {
                title: 'Disabled constrained example',
                code: "<div movable [movableEnabled]=\"toggle\" [movableConstrained]=\"false\">\n  <div><b>Movable explicitly disabled contrained</b></div>\n  This movable can left the window (visible viewport).\n</div>"
            },
        ];
        this.movable = new BehaviorSubject_1.BehaviorSubject(1);
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.movable
            .subscribe(function (id) {
            _this.vcRef.clear();
            var code = _this.templates[id - 1].code || _this.templates[0].code;
            var component = _this.createDynamicComponent(code);
            var module = _this.createDynamicModule(component);
            _this.compiler.compileModuleAndAllComponentsAsync(module)
                .then(function (moduleWithComponentFactories) {
                var componentFactory = moduleWithComponentFactories.componentFactories.find(function (element) { return element.componentType === component; });
                _this.componentRef = _this.vcRef.createComponent(componentFactory);
            });
        });
    };
    AppComponent.prototype.createDynamicComponent = function (template) {
        var DynamicComponent = (function () {
            function DynamicComponent(element) {
                this.element = element;
                this.code = template;
                this.toggle = true;
            }
            DynamicComponent.prototype.ngOnInit = function () {
                var blockElement = document.createElement('div');
                blockElement.innerHTML = '<div class="hljs code" style="">' +
                    'Code:<pre class="hljs" style="margin: 0">' +
                    hljs.highlightAuto(this.code, ['xml']).value +
                    '</pre></div>';
                this.element.nativeElement.appendChild(blockElement);
            };
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Boolean)
            ], DynamicComponent.prototype, "toggle", void 0);
            DynamicComponent = __decorate([
                core_1.Component({
                    selector: 'dynamic-content',
                    template: template,
                    styles: [":host /deep/ .code {\n        background-color: #abb2bf;\n        color: #282c34;\n        font-family: monospace;\n        padding: 0.1em;\n        margin: 1.0em 0.1em 0.1em 0.1em;\n      }\n      "]
                }), 
                __metadata('design:paramtypes', [core_1.ElementRef])
            ], DynamicComponent);
            return DynamicComponent;
        }());
        ;
        return DynamicComponent;
    };
    AppComponent.prototype.createDynamicModule = function (component) {
        var DynamicModule = (function () {
            function DynamicModule() {
            }
            DynamicModule = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, index_1.MovableModule],
                    declarations: [component]
                }), 
                __metadata('design:paramtypes', [])
            ], DynamicModule);
            return DynamicModule;
        }());
        ;
        return DynamicModule;
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'sd-app',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.css']
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.Compiler])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFaRDtnQkFBQyxZQUFLLEVBQUU7OzREQUFBO1lBZFY7Z0JBQUMsZ0JBQVMsQ0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsd01BT1IsQ0FBQztpQkFDSCxDQUFDOztnQ0FBQTtZQWdCRix1QkFBQztRQUFELENBZkEsQUFlQyxJQUFBO1FBQUEsQ0FBQztRQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU8sMENBQW1CLEdBQTNCLFVBQTRCLFNBQWM7UUFLeEM7WUFBQTtZQUFzQixDQUFDO1lBSnZCO2dCQUFDLGVBQVEsQ0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLHFCQUFhLENBQUM7b0JBQ3ZDLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQztpQkFDMUIsQ0FBQzs7NkJBQUE7WUFDb0Isb0JBQUM7UUFBRCxDQUF0QixBQUF1QixJQUFBO1FBQUEsQ0FBQztRQUN4QixNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUF4SEg7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUM7U0FDakMsQ0FBQzs7b0JBQUE7SUFxSEYsbUJBQUM7QUFBRCxDQXBIQSxBQW9IQyxJQUFBO0FBcEhZLG9CQUFZLGVBb0h4QixDQUFBIiwiZmlsZSI6ImFwcC9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBWaWV3Q29udGFpbmVyUmVmLCBFbGVtZW50UmVmLFxuICBDb21waWxlciwgQ29tcG9uZW50UmVmLCBOZ01vZHVsZSxcbiAgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0LCBJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMvQmVoYXZpb3JTdWJqZWN0JztcbmltcG9ydCAqIGFzIGhsanMgZnJvbSAnaGlnaGxpZ2h0LmpzJztcblxuaW1wb3J0IHsgTW92YWJsZU1vZHVsZSB9IGZyb20gJy4vbmcyLW1vdmFibGUvaW5kZXgnO1xuXG5cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnc2QtYXBwJyxcbiAgdGVtcGxhdGVVcmw6ICdhcHAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYXBwLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBwcm90ZWN0ZWQgdGVtcGxhdGVzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnU2ltcGxlIGV4YW1wbGUnLFxuICAgICAgY29kZTogYDxkaXYgbW92YWJsZSBbbW92YWJsZUVuYWJsZWRdPVwidG9nZ2xlXCI+XG4gIDxkaXY+PGI+U2ltcGxlIG1vdmFibGU8L2I+PC9kaXY+XG4gIFRoZSBjb21wbGV0ZSBlbGVtZW50IGNhbiBiZSB1c2VkIGZvciBtb3ZpbmcuPGJyIC8+XG4gIDxidXR0b24gKGNsaWNrKT1cInRvZ2dsZSA9ICF0b2dnbGVcIj50b2dnbGUgZW5hYmxlZCBzdGF0ZTwvYnV0dG9uPlxuPC9kaXY+YFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdIYW5kbGUgRXhhbXBsZScsXG4gICAgICBjb2RlOiBgPGRpdiBtb3ZhYmxlIFttb3ZhYmxlRW5hYmxlZF09XCJ0b2dnbGVcIj5cbiAgPGRpdiBtb3ZhYmxlSGFuZGxlPjxiPk1vdmFibGUgd2l0aCBoYW5kbGU8L2I+PC9kaXY+XG4gIE9ubHkgdGhlIGhhbmRsZSBlbGVtZW50IGNhbiBiZSB1c2VkIGZvciBtb3ZpbmcuPGJyIC8+XG4gIDxidXR0b24gKGNsaWNrKT1cInRvZ2dsZSA9ICF0b2dnbGVcIj50b2dnbGUgZW5hYmxlZCBzdGF0ZTwvYnV0dG9uPlxuPC9kaXY+YFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdIYW5kbGUgRXhhbXBsZSAyJyxcbiAgICAgIGNvZGU6IGA8ZGl2IG1vdmFibGUgW21vdmFibGVFbmFibGVkXT1cInRvZ2dsZVwiPlxuICA8ZGl2IG1vdmFibGVIYW5kbGU+PGI+TW92YWJsZSB3aXRoIGhhbmRsZTwvYj48L2Rpdj5cbiAgPGRpdiBtb3ZhYmxlPVwiaGFuZGxlMlwiPjxkaXYgbW92YWJsZUhhbmRsZT1cImhhbmRsZTJcIj5hbm90aGVyIGhhbmRsZTwvZGl2PmFub3RoZXIgbW92YWJsZTwvZGl2PlxuICBPbmx5IHRoZSBoYW5kbGUgZWxlbWVudCBjYW4gYmUgdXNlZCBmb3IgbW92aW5nLjxiciAvPlxuICA8YnV0dG9uIChjbGljayk9XCJ0b2dnbGUgPSAhdG9nZ2xlXCI+dG9nZ2xlIGVuYWJsZWQgc3RhdGU8L2J1dHRvbj5cbjwvZGl2PmBcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnUmVsYXRpdiBzdGFydCBwb3NpdGlvbiBFeGFtcGxlJyxcbiAgICAgIGNvZGU6IGA8ZGl2IGNsYXNzPVwicmVsYXRpdnBvc1wiIG1vdmFibGUgW21vdmFibGVFbmFibGVkXT1cInRvZ2dsZVwiPlxuICA8ZGl2PjxiPlNpbXBsZSBtb3ZhYmxlIHdpdGggcmVsYXRpdiBzdGFydCBwb3NpdGlvbiBieSBjbGFzczwvYj48L2Rpdj5cbiAgVGhlIGNvbXBsZXRlIGVsZW1lbnQgY2FuIGJlIHVzZWQgZm9yIG1vdmluZy48YnIgLz5cbiAgPGJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlID0gIXRvZ2dsZVwiPnRvZ2dsZSBlbmFibGVkIHN0YXRlPC9idXR0b24+XG48L2Rpdj5gXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0NvbnN0cmFpbmVkIGV4YW1wbGUnLFxuICAgICAgY29kZTogYDxkaXYgc3R5bGU9XCJib3JkZXI6IDAuMmVtIGRvdHRlZCByZWQ7IGhlaWdodDogMTAwcHg7IHdpZHRoOiA1MDBweDtcIiBpZD1cImNvbnN0cmFpbmVkQnlFbGVtZW50XCI+XG4gIDxkaXYgbW92YWJsZSBbbW92YWJsZUVuYWJsZWRdPVwidG9nZ2xlXCIgbW92YWJsZUNvbnN0cmFpbnQ9XCJjb25zdHJhaW5lZEJ5RWxlbWVudFwiPlxuICAgIDxkaXY+PGI+TW92YWJsZSBjb25zdHJhaW5lZCB0byBhbiBlbGVtZW50PC9iPjwvZGl2PlxuICAgIFRoaXMgbW92YWJsZSB3b24ndCBsZWZ0IHRoZSBjb25zdHJhaW5lZCBlbGVtZW50LlxuICA8L2Rpdj5cbjwvZGl2PmBcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnRGlzYWJsZWQgY29uc3RyYWluZWQgZXhhbXBsZScsXG4gICAgICBjb2RlOiBgPGRpdiBtb3ZhYmxlIFttb3ZhYmxlRW5hYmxlZF09XCJ0b2dnbGVcIiBbbW92YWJsZUNvbnN0cmFpbmVkXT1cImZhbHNlXCI+XG4gIDxkaXY+PGI+TW92YWJsZSBleHBsaWNpdGx5IGRpc2FibGVkIGNvbnRyYWluZWQ8L2I+PC9kaXY+XG4gIFRoaXMgbW92YWJsZSBjYW4gbGVmdCB0aGUgd2luZG93ICh2aXNpYmxlIHZpZXdwb3J0KS5cbjwvZGl2PmBcbiAgICB9LFxuICBdO1xuXG4gIHByb3RlY3RlZCBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+O1xuICBwdWJsaWMgbW92YWJsZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigxKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIGNvbXBpbGVyOiBDb21waWxlcikge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMubW92YWJsZVxuICAgICAgLnN1YnNjcmliZShpZCA9PiB7XG4gICAgICAgIHRoaXMudmNSZWYuY2xlYXIoKTtcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLnRlbXBsYXRlc1tpZCAtIDFdLmNvZGUgfHwgdGhpcy50ZW1wbGF0ZXNbMF0uY29kZTtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuY3JlYXRlRHluYW1pY0NvbXBvbmVudChjb2RlKTtcbiAgICAgICAgdmFyIG1vZHVsZSA9IHRoaXMuY3JlYXRlRHluYW1pY01vZHVsZShjb21wb25lbnQpO1xuICAgICAgICB0aGlzLmNvbXBpbGVyLmNvbXBpbGVNb2R1bGVBbmRBbGxDb21wb25lbnRzQXN5bmMobW9kdWxlKVxuICAgICAgICAgIC50aGVuKG1vZHVsZVdpdGhDb21wb25lbnRGYWN0b3JpZXMgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudEZhY3RvcnkgPSBtb2R1bGVXaXRoQ29tcG9uZW50RmFjdG9yaWVzLmNvbXBvbmVudEZhY3Rvcmllcy5maW5kKGVsZW1lbnQgPT4gZWxlbWVudC5jb21wb25lbnRUeXBlID09PSBjb21wb25lbnQpO1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSB0aGlzLnZjUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEeW5hbWljQ29tcG9uZW50KHRlbXBsYXRlOiBzdHJpbmcpIHtcbiAgICBAQ29tcG9uZW50KHtcbiAgICAgIHNlbGVjdG9yOiAnZHluYW1pYy1jb250ZW50JyxcbiAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICAgIHN0eWxlczogW2A6aG9zdCAvZGVlcC8gLmNvZGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYWJiMmJmO1xuICAgICAgICBjb2xvcjogIzI4MmMzNDtcbiAgICAgICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcbiAgICAgICAgcGFkZGluZzogMC4xZW07XG4gICAgICAgIG1hcmdpbjogMS4wZW0gMC4xZW0gMC4xZW0gMC4xZW07XG4gICAgICB9XG4gICAgICBgXVxuICAgIH0pXG4gICAgY2xhc3MgRHluYW1pY0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgICBwcm90ZWN0ZWQgY29kZSA9IHRlbXBsYXRlO1xuICAgICAgQElucHV0KClcbiAgICAgIHB1YmxpYyB0b2dnbGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgfVxuICAgICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHZhciBibG9ja0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYmxvY2tFbGVtZW50LmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiaGxqcyBjb2RlXCIgc3R5bGU9XCJcIj4nICtcbiAgICAgICAgICAnQ29kZTo8cHJlIGNsYXNzPVwiaGxqc1wiIHN0eWxlPVwibWFyZ2luOiAwXCI+JyArXG4gICAgICAgICAgaGxqcy5oaWdobGlnaHRBdXRvKHRoaXMuY29kZSwgWyd4bWwnXSkudmFsdWUgK1xuICAgICAgICAgICc8L3ByZT48L2Rpdj4nO1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChibG9ja0VsZW1lbnQpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIER5bmFtaWNDb21wb25lbnQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUR5bmFtaWNNb2R1bGUoY29tcG9uZW50OiBhbnkpIHtcbiAgICBATmdNb2R1bGUoe1xuICAgICAgaW1wb3J0czogW0Jyb3dzZXJNb2R1bGUsIE1vdmFibGVNb2R1bGVdLFxuICAgICAgZGVjbGFyYXRpb25zOiBbY29tcG9uZW50XVxuICAgIH0pXG4gICAgY2xhc3MgRHluYW1pY01vZHVsZSB7IH07XG4gICAgcmV0dXJuIER5bmFtaWNNb2R1bGU7XG4gIH1cblxufVxuIl19
