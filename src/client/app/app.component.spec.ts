import { Component, ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { async } from '@angular/core/testing';
import { AppComponent } from './app.component';


export function main() {


  describe('App component', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [TestComponent, AppComponent],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      })
        .compileComponents()
        .then(() => {
          this.fixture = TestBed.createComponent(TestComponent);
          this.component = this.fixture.debugElement.children[0].componentInstance;
          this.dome = this.fixture.debugElement.children[0].nativeElement;

          // 1st change detection triggers ngOnInit
          this.fixture.detectChanges();
          return this.fixture.whenStable().then(() => {
            // 2nd change detection displays the async-fetched stuff
            this.fixture.detectChanges();
          });
        });
    }));

    it('should build without a problem', () => {
      expect(this.fixture.nativeElement).toBeTruthy();
    });

    it('dynamically created component exists', () => {
      expect(this.component.componentRef).toEqual(jasmine.any(ComponentRef));
      expect(this.component.componentRef.instance.toggle).toBeTruthy();
    });

  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-app></sd-app>'
})
class TestComponent {
}
