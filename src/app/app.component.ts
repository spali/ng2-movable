import { Component } from '@angular/core';
import { ExamplesComponent } from './examples/examples.component';

declare function require(moduleName: string): any;

const { version: appVersion } = require('../../package.json');
const { version: libVersion } = require('../lib/package.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public appVersion: string;
  public libVersion: string;

  constructor() {
    this.appVersion = appVersion;
    this.libVersion = libVersion;
  }
}
