import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[movableBumper]'
})
export class MovableBumperDirective {

  @HostBinding('class.movable-bumper')
  protected isBumper: boolean = true;

}
