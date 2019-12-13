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
import { ExportComponent } from '../export/export.component';
import { RouteListComponent } from './routes-management/list/list-routes.component';
import { ExportRoutesComponent } from './routes-management/export/export-routes.component';
import { EditRouteComponent } from './routes-management/edit/edit-routes.component';
// import { ServiceManagementComponent } from './service-management/service-management.component';
import { ServiceInfoComponent } from './routes-management/service-info/service-info.component';
const declarations = [
  TabDemoComponent,
  ValidationDemoComponent,
  DashboardDemoComponent,
  ButtonDemoComponent,
  ListDemo1Component,
  EditComponent,
  ImportExcelComponent,
  ExportComponent,
  RouteListComponent,
  ExportRoutesComponent,
  EditRouteComponent,
ServiceInfoComponent
];

@NgModule({
  declarations: declarations,
  exports: declarations,
  entryComponents: declarations,
  imports: [
    FormsModule,
    CommonModule,
    Framework4CModule.forRoot()
  ],
})

export class DemoModule { }
