import { Component, Input } from '@angular/core';

import { ExampleComponent } from '../example.component';

const template = `<div movable [movableEnabled]="toggle" movableChildSelector=".move-me">
  <div><b>Movable child</b></div>

  <div class="move-me">
  <strong>New in v0.3.2!</strong>
  The directive can also apply all movable logic to a child element.<br>
  This gives you super-power when hacking existing 3rd party controls.<br>
  <button (click)="toggle = !toggle">toggle enabled state</button>
  </div>
</div>`;

@Component({
  selector: 'app-example7',
  template: template
})
export class Example7Component extends ExampleComponent {
  public template = template;

  @Input()
  public toggle = true;
}
