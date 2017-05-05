import {
  Component, ViewContainerRef, ElementRef,
  Compiler, ComponentRef, NgModule,
  AfterViewInit, OnInit, Input
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as hljs from 'highlight.js';

import { MovableModule } from './ng2-movable/index';



@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements AfterViewInit {

  protected templates = [
    {
      title: 'Simple example',
      code: `<div movable [movableEnabled]="toggle">
  <div><b>Simple movable</b></div>
  The complete element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`
    },
    {
      title: 'Handle Example',
      code: `<div movable [movableEnabled]="toggle">
  <div movableHandle><b>Movable with handle</b></div>
  Only the handle element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`
    },
    {
      title: 'Handle Example 2',
      code: `<div movable [movableEnabled]="toggle">
  <div movableHandle><b>Movable with handle</b></div>
  <div movable="handle2"><div movableHandle="handle2">another handle</div>another movable</div>
  Only the handle element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`
    },
    {
      title: 'Relativ start position Example',
      code: `<div class="relativpos" movable [movableEnabled]="toggle">
  <div><b>Simple movable with relativ start position by class</b></div>
  The complete element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`
    },
    {
      title: 'Constrained example',
      code: `<div style="border: 0.2em dotted red; height: 100px; width: 500px;" id="constrainedByElement">
  <div movable [movableEnabled]="toggle" movableConstraint="constrainedByElement">
    <div><b>Movable constrained to an element</b></div>
    This movable won't left the constrained element.
  </div>
</div>`
    },
    {
      title: 'Disabled constrained example',
      code: `<div movable [movableEnabled]="toggle" [movableConstrained]="false">
  <div><b>Movable explicitly disabled contrained</b></div>
  This movable can left the window (visible viewport).
</div>`
    },
  ];

  protected componentRef: ComponentRef<any>;
  public movable = new BehaviorSubject<number>(1);

  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {
  }

  ngAfterViewInit() {
    this.movable
      .subscribe(id => {
        this.vcRef.clear();
        var code = this.templates[id - 1].code || this.templates[0].code;
        var component = this.createDynamicComponent(code);
        var module = this.createDynamicModule(component);
        this.compiler.compileModuleAndAllComponentsAsync(module)
          .then(moduleWithComponentFactories => {
            var componentFactory = moduleWithComponentFactories.componentFactories.find(element => element.componentType === component);
            this.componentRef = this.vcRef.createComponent(componentFactory);
          });
      });
  }

  private createDynamicComponent(template: string) {
    @Component({
      selector: 'dynamic-content',
      template: template,
      styles: [`:host /deep/ .code {
        background-color: #abb2bf;
        color: #282c34;
        font-family: monospace;
        padding: 0.1em;
        margin: 1.0em 0.1em 0.1em 0.1em;
      }
      `]
    })
    class DynamicComponent implements OnInit {
      protected code = template;
      @Input()
      public toggle: boolean = true;

      constructor(public element: ElementRef) {
      }
      ngOnInit() {
        var blockElement = document.createElement('div');
        blockElement.innerHTML = '<div class="hljs code" style="">' +
          'Code:<pre class="hljs" style="margin: 0">' +
          hljs.highlightAuto(this.code, ['xml']).value +
          '</pre></div>';
        this.element.nativeElement.appendChild(blockElement);
      }
    };
    return DynamicComponent;
  }

  private createDynamicModule(component: any) {
    @NgModule({
      imports: [BrowserModule, MovableModule],
      declarations: [component]
    })
    class DynamicModule { };
    return DynamicModule;
  }

}
