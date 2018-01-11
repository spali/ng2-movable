import { Component, ViewChild, ElementRef, ComponentRef, Renderer2 } from '@angular/core';
import { Router, Route } from '@angular/router';

import * as hljs from 'highlight.js';

import { ExampleComponent } from './example.component';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent {

  public examples: Route[];

  @ViewChild('code')
  private codeElementRef: ElementRef;

  @ViewChild('codeContainer')
  private codeContainerElementRef: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {
    this.examples = [].concat.apply([],
      this.router.config
        .filter((config) => config.component === ExamplesComponent && config.children && config.children.length > 0)
        .map((config) => config.children)
    );
  }

  private setCode(code?: string) {
    if (code) {
      const highlightedCode = hljs.highlightAuto(code, ['xml']).value;
      // this.renderer.removeStyle(this.codeElementRef.nativeElement, 'display');
      this.renderer.setProperty(this.codeElementRef.nativeElement, 'innerHTML', highlightedCode);
      this.renderer.removeStyle(this.codeContainerElementRef.nativeElement, 'display');
    } else {
      this.renderer.setStyle(this.codeContainerElementRef.nativeElement, 'display', 'none');
      this.renderer.setProperty(this.codeElementRef.nativeElement, 'innerHTML', null);
    }
  }

  onActivate(component: ComponentRef<any>) {
    if (component instanceof ExampleComponent) {
      this.setCode(component.template);
    } else {
      this.setCode();
    }
  }

}
