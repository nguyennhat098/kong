import { NgModule } from '@angular/core';
import { TabDemoComponent } from './tab';
import { ValidationDemoComponent } from './validation';
import { DashboardDemoComponent } from './dashboard';
import { ButtonDemoComponent } from './button';
import { FormsModule } from '@angular/forms';
import { Framework4CModule } from 'ngx-fw4c';
import { ListDemo1Component } from '../list-demo1/list-demo1.component';
import { AddRouterComponent } from '../add-router/add-router.component';
import { EditComponent } from '../edit/edit.component';
import { CommonModule } from '@angular/common';

const declarations = [
  TabDemoComponent,
  ValidationDemoComponent,
  DashboardDemoComponent,
  ButtonDemoComponent,
  ListDemo1Component,
  AddRouterComponent,
     EditComponent,
    
];

@NgModule({
  declarations: declarations,
  exports: declarations,
  entryComponents: declarations,
  imports: [
    FormsModule,
    CommonModule,
    Framework4CModule.forRoot()
  ]
})

export class DemoModule { }
