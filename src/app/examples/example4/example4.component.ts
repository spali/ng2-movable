import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div class="relativpos" movable [movableEnabled]="toggle">
  <div><b>Simple movable with relativ start position by class</b></div>
  The complete element can be used for moving.<br />
  <button (click)="toggle = !toggle">toggle enabled state</button>
</div>`;

@Component({
  selector: 'app-example4',
  template: template
})
export class Example4Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
