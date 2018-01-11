import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div movable [movableEnabled]="toggle">
  <div><b>Simple movable</b></div>
  The complete element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`;

@Component({
  selector: 'app-example1',
  template: template
})
export class Example1Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
