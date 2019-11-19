import { ButtonDemoService } from './../button/button-demo.service';
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { ButtonDemoComponent } from '../button';
import { of } from 'rxjs';
import { TableOption, ModalService, DataService, TemplateViewModel, TableComponent, ConfirmViewModel, TableConstant, TableMode, TableColumnType } from 'ngx-fw4c';

@Component({
  selector: 'dashboard-demo',
  templateUrl: './dashboard-demo.component.html'
})

export class DashboardDemoComponent implements OnInit {
  @ViewChild('imageTemplate', { static: true }) public imageTemplate: TemplateRef<any>;
  public option: TableOption;

  constructor(
    private _modalService: ModalService,
    private _dataService: DataService,private _buttonService:ButtonDemoService
  ) { }

  ngOnInit(): void {
    this.initTable();
  }

  private initTable(): void {
   
    this.option = new TableOption({
     
      topButtons: [
        {
          icon: 'fa fa-plus',
          customClass: 'primary',
          title: () => 'New',
          executeAsync: (item) => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: ButtonDemoComponent,
              data: item
            }));
          }
        },
        {
          icon: 'fa fa-edit',
          customClass: 'danger',
          title: () => 'Test',
          executeAsync: (item) => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: ButtonDemoComponent,
              data: item
            }));
          }
        }
      ],
      actions: [
        {
          icon: 'fa fa-edit',
          executeAsync: () => {
            //call other api....
          }
        },
        {
          icon: 'fa fa-remove',
          executeAsync: () => {
          }
        },
        {
          icon: 'fa fa-search',
          executeAsync: (item, e, provider: TableComponent) => {
            provider.copy(item);
            this._modalService.showConfirmDialog(new ConfirmViewModel({
              title: 'Test',
              message: 'abc?',
              btnAcceptTitle: 'changed',
              acceptCallback: () => {
              }
            }));
          }
        },
        {
          type: TableConstant.ActionType.Toolbar,
          icon: 'fa fa-refresh',
          title: () => 'Refresh',
          executeAsync: () => {
          }
        },
      ],
      inlineEdit: true,
      mode: TableMode.full,
      searchFields: ['name', 'age'],
      mainColumns: [
        {
          type: TableColumnType.String,
          title: () => 'host',
          valueRef: () => 'host',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'Create at',
          valueRef: () => 'created_at',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'Time',
          valueRef: () => 'connect_timeout',
          allowFilter: true
        },
        {
          type: TableColumnType.String,
          title: () => 'protocol',
          valueRef: () => 'protocol',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'name',
          valueRef: () => 'name',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'read_timeout',
          valueRef: () => 'read_timeout',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'port',
          valueRef: () => 'port',
          allowFilter: false,
          width: 200
        },
      ],
      serviceProvider: {
        searchAsync: request => {
          return this._buttonService.getService(request);
        }
      }
    });
  }

}
