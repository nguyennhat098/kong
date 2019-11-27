import { TableOption, ValidationService, ModalService, TemplateViewModel, TableComponent, ConfirmViewModel, TableConstant, TableMode, TableColumnType, DataService } from 'ngx-fw4c';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { ServiceViewModel, RouterService, RouterViewModel } from '../service/router.service';
import { of } from 'rxjs';
import { ImportExcelComponent } from '../import-excel/import-excel.component';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
@Component({
  selector: 'app-list-demo1',
  templateUrl: './list-demo1.component.html',
  styleUrls: ['./list-demo1.component.scss']
})
export class ListDemo1Component implements OnInit {
  @ViewChild('tableTemplate', { static: true }) public tableTemplate: TableComponent;
  @ViewChild('imageTemplate', { static: true }) public imageTemplate: TemplateRef<any>;

  public option: TableOption;
  data = [];
  constructor(private _modalService: ModalService
    , private routerService: RouterService, private _dataService: DataService, private http: HttpClient) { }
  services: ServiceViewModel[] = [];

  getData(): void {
    this.data = [];
    this.http.get('http://localhost:8001/routes').subscribe((res: any) => {
      for (let index = 0; index < res.data.length; index++) {
        this.data.push(res.data[index]);
      }
      this.tableTemplate.reload();
    });
  }

  ngOnInit(): void {
    this.getData();
    // this.http.get('http://192.168.110.46:8001/services').subscribe((res: any) => {
    //   this.services = res.data;
    // })
    this.initTable();
  }

  private initTable() {

    this.option = new TableOption({
      localData: () => {

        return of(this.data)
      },
      topButtons: [
        {
          icon: 'fa fa-plus',
          customClass: 'primary',
          title: () => 'New',
          executeAsync: () => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: EditComponent,
              customSize: 'modal-lg',
              title: 'ADD ROUTE TO TEST',
              validationKey: 'AddRouterComponent',
              data: {
                item: new RouterViewModel
              },
              acceptCallback: item => {
                this.routerService.addRouter(item).subscribe(() => {
                  this.getData();
                });
              }
            }));
          },
        },
        {
          icon: 'fa fa-print',
          customClass: 'success',
          title: () => 'Export Excel',
          executeAsync: () => {
            this.routerService.exportAsExcel(this.data, 'sample');

          },
        },
        {
          icon: 'fa fa-upload',
          customClass: 'info',
          title: () => 'Import Excel',
          executeAsync: () => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: ImportExcelComponent,
              customSize: 'modal-lg',
              title: 'IMPORT EXCEL',
              validationKey: 'ImportExcelComponent',
              acceptCallback: items => {
                for (let index = 0; index < items.length; index++) {
                  const element = items[index];
                  var item = new RouterViewModel();
                  item.hosts = element.hosts ? element.hosts.split(',') : [];
                  item.https_redirect_status_code = element.https_redirect_status_code;
                  item.methods = element.methods ? element.methods.split(',') : [];
                  item.name = element.name;
                  item.paths = element.paths ? element.paths.split(',') : [];
                  item.preserve_host = element.preserve_host;
                  item.protocols = element.protocols ? element.protocols.split(',') : [];
                  item.regex_priority = element.regex_priority;
                  item.service = new ServiceViewModel();
                  item.service.id = element.service;
                  item.strip_path = element.strip_path;
                  item.tags = element.tags ? element.tags.split(',') : [];
                  this.routerService.addRouter(item).subscribe(() => {
                    if (index == items.length - 1) {
                      this.getData();
                    }
                  })
                }
              }
            }));
          },
        },
        {
          icon: "fa fa-save",
          title: () => "Save",
          customClass:"warning",
          hide:()=>{
            if(this.tableTemplate.changedRows.length===0)return true;
            return false;
          },
          executeAsync: () => {
            var items = this.tableTemplate.changedRows;
            for (let index = 0; index < items.length; index++) {
              const element = items[index].currentItem;
              var currentItem = new RouterViewModel();
              currentItem.strip_path = element.strip_path;
              currentItem.hosts = element.hosts;
              currentItem.https_redirect_status_code = element.https_redirect_status_code;
              currentItem.id = element.id;
              currentItem.methods = element.methods;
              currentItem.name = element.name;
              currentItem.paths = element.paths;
              currentItem.preserve_host = element.preserve_host;
              currentItem.protocols = element.protocols;
              currentItem.regex_priority = element.regex_priority;
              currentItem.service = element.service;
              currentItem.tags = element.tags;
              this.routerService.editRouter(currentItem, () => {
                if (index == items.length - 1) {
                  this.tableTemplate.changedRows=[];
                  this.getData();
                }
              })
            }
          }
        }
      ],
      actions: [
        {
          icon: 'fa fa-edit',
          executeAsync: (item: RouterViewModel) => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              customSize: 'modal-lg',
              template: EditComponent,
              validationKey: 'EditComponent',
              data: {
                item: this._dataService.cloneItem(item)
              },
              title: 'EDIT ROUTE TO TEST',
              acceptCallback: item1 => {
                this.routerService.editRouter(item1, () => {
                  this.getData();
                });
              },
              cancelCallback: () => {
              }
            }))
          }
        },
        {
          icon: 'fa fa-remove',
          executeAsync: (item: any) => {
            this._modalService.showConfirmDialog(new ConfirmViewModel({
              title: 'Delete',
              message: 'Are you sure?',
              btnAcceptTitle: 'Ok',
              acceptCallback: () => {
                this.routerService.deleteRouter(item, () => {
                  this.getData();
                })
              }
            }))
          }
        },
        {
          type: TableConstant.ActionType.Toolbar,
          icon: 'fa fa-remove',
          title: () => 'Remove',
          customClass: 'danger',
          executeAsync: () => {
            this._modalService.showConfirmDialog(new ConfirmViewModel({
              title: 'Remove',
              message: 'Delete All',
              acceptCallback: () => {
                var data = this.tableTemplate.selectedItems;
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
                  this.routerService.deleteRouter(element, () => {
                    if (index == data.length - 1) {
                      this.getData();
                    }
                  })
                }
              }
            }))
          }
        },
        {
          type: TableConstant.ActionType.Toolbar,
          icon: 'fa fa-copy',
          title: () => 'Copy',
          customClass: 'success',
          executeAsync: () => {
            var itemCopy = this._dataService.cloneItems(this.tableTemplate.selectedItems);
            for (let index = 0; index < itemCopy.length; index++) {
              var element = itemCopy[index];
              if(element.name){
                var checkCopy = this.data.filter(s =>s.name&& s.name.includes(element.name+ '_copy') && s.name.length >= element.name.length + 5 && s.name.length <= element.name.length + 7);
              }else{
                var checkCopy = this.data.filter(s =>s.name&& s.name.includes('_copy') && s.name.length >=  5 && s.name.length <= 7);
              }
              element.name =element.name? element.name + '_copy' + (checkCopy.length + 1):  '_copy' + (checkCopy.length + 1);
              this.routerService.addRouter(element).subscribe(res => {
                this.data.push(element);
                if (index == itemCopy.length - 1) {
                  this.getData();
                }
              });
            }
          }
        },
      ],
      inlineEdit: true,
      mode: TableMode.full,
      searchFields: ['created_at', 'name', 'tags', 'hosts', 'paths'],
      mainColumns: [
        {
          type: TableColumnType.String,
          title: () => 'name',
          valueRef: () => 'name',
          allowFilter: true
        },
        {
          type: TableColumnType.String,
          title: () => 'tags',
          valueRef: () => 'tags',
          allowFilter: true
        },
        {
          type: TableColumnType.String,
          title: () => 'hosts',
          valueRef: () => 'hosts',
          allowFilter: true,

        },
        {
          type: TableColumnType.String,
          title: () => 'service',
          valueRef: () => 'service.id',
          allowFilter: true
        },
        {
          type: TableColumnType.String,
          title: () => 'paths',
          valueRef: () => 'paths',
          allowFilter: true
        },
        // {
        //   type: TableColumnType.Date,
        //   title: () => 'created at',
        //   valueRef: () => 'created_at',
        //   allowFilter: true
        // }
      ],
      serviceProvider: {
        searchAsync: request => {
          return of(true);
        }
      }
    });
  }
}