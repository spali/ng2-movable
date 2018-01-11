import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div style="border: 0.2em dotted red; height: 100px; width: 500px;" id="constrainedByElement">
  <div movable [movableEnabled]="toggle" movableConstraint="constrainedByElement">
    <div><b>Movable constrained to an element</b></div>
    This movable won't left the constrained element.
  </div>
</div>`;

@Component({
  selector: 'app-example5',
  template: template
})
export class Example5Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
