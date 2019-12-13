
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuTab, AdminLayoutComponent, AuthComponent } from 'ngx-fw4c';
import { TabDemoComponent, ValidationDemoComponent, ButtonDemoComponent } from './demo';
import { DashboardDemoComponent } from './demo/dashboard';
import { ListDemo1Component } from './list-demo1/list-demo1.component';
import { RouteListComponent } from './demo/routes-management/list/list-routes.component';
import { ServiceManagementComponent } from './demo/service-management/service-management.component';

const menuTabs: MenuTab[] = [
  {
    role: 'Admin',
    items: [
      {
        label: 'Dashboard',
        icon: 'fa fa-pie-chart ',
        children: [
          { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'fa fa-pie-chart' }
        ]
      },
      {
        label: 'Components',
        icon: 'fa fa-search',
        children: [
          { state: 'tab', mainState: 'component', name: 'Tab', type: 'link', icon: 'fa fa-clone' },
          { state: 'button', mainState: 'component', name: 'Button', type: 'link', icon: 'fa fa-battery-empty' },
          { state: 'list-demo', mainState: 'component', name: 'list-demo', type: 'link', icon: 'fa fa-battery-empty' }
        ]
      },
      {
        label: 'Service Management',
        icon: 'fa fa-bar-chart',
        children: [
          { state: 'service', name: 'Service Management', type: 'link', icon: 'fa fa-calendar-check-o' }
        ]
      },
      {
        label: 'Validation',
        icon: 'fa fa-twitter',
        children: [
          { state: 'validation', name: 'Validation', type: 'link', icon: 'fa fa-calendar-check-o' }
        ]
      },
      {
        label: 'routes',
        icon: 'fa fa-twitter',
        children: [
          { state: 'routes-list', name: 'Route Management', type: 'link', icon: 'fa fa-calendar-check-o' }
        ]
      }
    ]
  }
];

const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent,
    data: {
      breadcrumb: {
        label: 'CMC Global',
        url: '/dashboard'
      },
      menuTabs: menuTabs,
      menuType:'TOP'
    },
    children: [
      {
        path: 'service',
        component: ServiceManagementComponent
      },
      {
        path: 'component',
        children: [
          {
            path: 'tab',
            component: TabDemoComponent
          },
          {
            path: 'button',
            component: ButtonDemoComponent
          },
          {
            path: 'list-demo',
            component: ListDemo1Component
          }
        ]
      },
      {
        path: 'validation',
        component: ValidationDemoComponent
      },
      {
        path: 'dashboard',
        component: DashboardDemoComponent
      },
      {
        path: 'auth',
        component: AuthComponent
      },
      {
        path: 'routes-list',
        component: RouteListComponent
      },
      {
        path: 'routes-list',
        component: RouteListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
