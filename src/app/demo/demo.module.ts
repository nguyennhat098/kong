import { NgModule } from '@angular/core';
import { TabDemoComponent } from './tab';
import { ValidationDemoComponent } from './validation';
import { DashboardDemoComponent } from './dashboard';
import { ButtonDemoComponent } from './button';
import { FormsModule } from '@angular/forms';
import { Framework4CModule } from 'ngx-fw4c';
import { ListDemo1Component } from '../list-demo1/list-demo1.component';
import { EditComponent } from '../edit/edit.component';
import { CommonModule } from '@angular/common';
import { ImportExcelComponent } from '../import-excel/import-excel.component';

const declarations = [
  TabDemoComponent,
  ValidationDemoComponent,
  DashboardDemoComponent,
  ButtonDemoComponent,
  ListDemo1Component,
     EditComponent,
    ImportExcelComponent
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
