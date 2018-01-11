import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div movable [movableEnabled]="toggle">
  <div movableHandle><b>Movable with handle</b></div>
  Only the handle element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`;

@Component({
  selector: 'app-example2',
  template: template
})
export class Example2Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
