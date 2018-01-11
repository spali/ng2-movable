import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div movable [movableEnabled]="toggle" [movableConstrained]="false">
  <div><b>Movable explicitly disabled contrained</b></div>
  This movable can left the window (visible viewport).
</div>`;

@Component({
  selector: 'app-example6',
  template: template
})
export class Example6Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
