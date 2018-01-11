import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div movable [movableEnabled]="toggle">
  <div movableHandle><b>Movable with handle</b></div>
  <div movable="handle2"><div movableHandle="handle2">another handle</div>another movable</div>
  Only the handle element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`;

@Component({
  selector: 'app-example3',
  template: template
})
export class Example3Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
