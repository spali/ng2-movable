import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamplesComponent } from './examples.component';
import { Example1Component } from './example1/example1.component';
import { Example2Component } from './example2/example2.component';
import { Example3Component } from './example3/example3.component';
import { Example4Component } from './example4/example4.component';
import { Example5Component } from './example5/example5.component';
import { Example6Component } from './example6/example6.component';

const routes: Routes = [
  {
    path: 'examples',
    component: ExamplesComponent,
    children: [
      { path: '', redirectTo: 'example1', pathMatch: 'full' },
      { path: 'example1', component: Example1Component, data: { title: 'Simple example' } },
      { path: 'example2', component: Example2Component, data: { title: 'Handle Example' } },
      { path: 'example3', component: Example3Component, data: { title: 'Handle Example 2' } },
      { path: 'example4', component: Example4Component, data: { title: 'Relativ start position Example' } },
      { path: 'example5', component: Example5Component, data: { title: 'Constrained example' } },
      { path: 'example6', component: Example6Component, data: { title: 'Disabled constrained example' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule { }
