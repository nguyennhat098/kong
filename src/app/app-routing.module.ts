
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuTab, AdminLayoutComponent, AuthComponent } from 'ngx-fw4c';
import { TabDemoComponent, ValidationDemoComponent, ButtonDemoComponent } from './demo';
import { DashboardDemoComponent } from './demo/dashboard';
import { ListDemo1Component } from './list-demo1/list-demo1.component';
import { AddRouterComponent } from './add-router/add-router.component';
import { EditComponent } from './edit/edit.component';

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
        label: 'Validation',
        icon: 'fa fa-twitter',
        children: [
          { state: 'validation', name: 'Validation', type: 'link', icon: 'fa fa-calendar-check-o' }
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
      menuTabs: menuTabs
    },
    children: [
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
          },
          {
            path:'add-router',
            component:AddRouterComponent,
          },
          {
            path:'edit-router/:Id',
            component:EditComponent
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
