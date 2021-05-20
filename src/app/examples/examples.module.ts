import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovableModule } from 'ng2-movable';

import { ExamplesRoutingModule } from './examples-routing.module';

import { ExamplesComponent } from './examples.component';
import { Example1Component } from './example1/example1.component';
import { Example2Component } from './example2/example2.component';
import { Example3Component } from './example3/example3.component';
import { Example4Component } from './example4/example4.component';
import { Example5Component } from './example5/example5.component';
import { Example6Component } from './example6/example6.component';
import { Example7Component } from './example7/example7.component';

@NgModule({
  imports: [
    CommonModule,
    MovableModule,
    ExamplesRoutingModule
  ],
  declarations: [
    ExamplesComponent,
    Example1Component,
    Example2Component,
    Example3Component,
    Example4Component,
    Example5Component,
    Example6Component,
    Example7Component
  ],
})
export class ExamplesModule { }
