import { ButtonDemoService } from './../demo/button/button-demo.service';
import { TableOption, ValidationService, ModalService, TemplateViewModel, TableComponent, ConfirmViewModel, TableConstant, TableMode, TableColumnType, DataService } from 'ngx-fw4c';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ButtonDemoComponent } from '../demo/button/button-demo.component';
import { ListDemoService } from './list-demo.service';
import { EditComponent } from '../edit/edit.component';
import { AddRouterComponent } from '../add-router/add-router.component';
import { async } from 'q';
export class Service {
  name?: string;
  Description?: string;
  tags?: string;
  url?: string;
  protocol?: string;
  host?: string;
  port?: number;
  path?: string;
  Retries?: string;
  Connect?: string;
  Write?: string;
  Read?: string;
  id?:string;
}

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
@Component({
  selector: 'app-list-demo1',
  templateUrl: './list-demo1.component.html',
  styleUrls: ['./list-demo1.component.scss']
})
export class ListDemo1Component implements OnInit {
  @ViewChild('tableTemplate',{static:true}) public tableTemplate:TableComponent;
  @ViewChild('imageTemplate', { static: true }) public imageTemplate: TemplateRef<any>;
  
  public option: TableOption;
  constructor( private _modalService: ModalService,private _lisdemoService:ListDemoService, private _dataService: DataService,private http:HttpClient) { }
services:Service[]= [];

  ngOnInit():void {
    this.http.get('http://192.168.35.108:8001/services').subscribe((res: any) => {
      this.services = res.data;
    })
    this.initTable();
  }
  
  // public option: TableOption;
  private initTable(): void {
   
    this.option = new TableOption({
     
      topButtons: [
        {
          icon: 'fa fa-plus',
          customClass: 'primary',
          title: () => 'New',
          executeAsync: ()=> {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: AddRouterComponent,
              customSize:'lg',
              acceptCallback:item=>{
                return this.http.post('http://192.168.35.108:8001/routes',item,httpOptions).subscribe(res=>{
                  this.tableTemplate.reload();
                })
              }
            }));
          },
        },
        {
          icon: 'fa fa-edit',
          customClass: 'danger',
          title: () => 'Test',
          executeAsync: (item) => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: ButtonDemoComponent,
              data: item,
              btnAcceptTitle:'Ok',
              
            }));
          }
        }
      ],
      actions: [
        {
          icon: 'fa fa-edit',
          executeAsync: (item:any) => {
           this._modalService.showTemplateDialog(new TemplateViewModel({
             template:EditComponent,
             data:{
              Item: item
              },
              acceptCallback:item=>{
                return this.http.put('http://192.168.35.108:8001/routes/'+item.id,item,httpOptions).subscribe(res=>{
                  this.tableTemplate.reload();
                })
              }
           }))
          }
        },
        {
          icon: 'fa fa-remove',
          executeAsync: (item:any) => {
            this._modalService.showConfirmDialog(new ConfirmViewModel({
              title:'Delete',
              message:'Are you sure?',
              btnAcceptTitle:'Ok',
              acceptCallback:()=>{
                return this.http.delete('http://192.168.35.108:8001/routes/'+item.id).subscribe(()=>{
                  this.tableTemplate.reload();
                });
              }
            }))
            
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
          title: () => 'id',
          valueRef: () => 'id',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'tags',
          valueRef: () => 'tags',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'hosts',
          valueRef: () => 'hosts',
          allowFilter: true
        },
        {
          type: TableColumnType.String,
          title: () => 'service',
          valueRef: () => 'service.name',
          allowFilter: false
        },
        {
          type: TableColumnType.String,
          title: () => 'paths',
          valueRef: () => 'paths',
          allowFilter: false
        },
        {
          type: TableColumnType.Date,
          title: () => 'created at',
          valueRef: () => 'created_at',
          allowFilter: false
        }
      ],
      serviceProvider: {
        searchAsync: request => {
          return this._lisdemoService.getService(request);
        }
      }
    });
  }

}
