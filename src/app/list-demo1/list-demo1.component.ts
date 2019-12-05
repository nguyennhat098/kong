import { TableOption, ValidationService, ModalService, TemplateViewModel, TableComponent, ConfirmViewModel, TableConstant, TableMode, TableColumnType, DataService, ValidationOption, RequiredValidationRule, CustomValidationRule, AggregatorService, KeyConst } from 'ngx-fw4c';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { ServiceViewModel, RouterService, RouterViewModel } from '../service/router.service';
import { of } from 'rxjs';
import { ImportExcelComponent } from '../import-excel/import-excel.component';
import { IgxExcelExporterOptions, IgxExcelExporterService } from "igniteui-angular";
import { ExportComponent } from '../export/export.component';

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
  constructor(private _modalService: ModalService,
    private routerService: RouterService,
    private _dataService: DataService,
    private http: HttpClient,
    protected aggregatorService: AggregatorService,
    private excelExportService: IgxExcelExporterService) { }
  services: ServiceViewModel[] = [];

  getData(): void {
    this.routerService.search(999).subscribe((res: any) => {
      this.data = res;
      this.tableTemplate.reload();
    });
  }

  ngOnInit(): void {
    this.getData();
    this.initTable();
  }

  importExcel(items) {
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      var item = new RouterViewModel();
      item.hosts = element.hosts ? element.hosts.split(',') : [];
      item.https_redirect_status_code = element.https_redirect_status_code;
      item.methods = element.methods ? element.methods.split(',') : [];
      item.name = element.name;
      item.paths = element.paths ? element.paths.split(',') : [];
      item.preserve_host = element.preserve_host == 'true' ? true : false;
      item.protocols = element.protocols ? element.protocols.split(',') : [];
      item.regex_priority = element.regex_priority;
      item.service = new ServiceViewModel();
      item.service.id = element.service;
      item.strip_path = element.strip_path == 'true' ? true : false;
      item.tags = element.tags ? element.tags.split(',') : [];
      this.routerService.addRouter(item).subscribe(() => {
        if (index == items.length - 1) {
          this.getData();
        }
      })
    }
  }

  private initTable() {
    this.option = new TableOption({
      localData: () => {
        return of(this.data);
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
              icon: 'fa fa-plus',
              validationKey: 'AddRouterComponent',
              data: {
                item: new RouterViewModel()
              },
              acceptCallback: item => {
                console.log(item)
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
          title: () => 'File',
          executeAsync: () => {
            // this.tableTemplate.exportToExcel('abc');
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: ExportComponent,
              icon: 'fa fa-print',
              title: 'File',
              validationKey: 'ExportComponent',
              acceptCallback: data => {
                if (data == 'exportExcel') {
                  this.routerService.exportExcel(this.data);
                }
                if (data == 'exportPdf') {
                  this.routerService.exportPdf(this.data);
                }
                if (data == 'template') {
                  this.routerService.exportTemplateExcel();
                }
                if (data && data[0].service) {
                  this.importExcel(data);
                }
              }
            }))

          },
        },
        {
          icon: "fa fa-save",
          title: () => "Save",
          customClass: "warning",
          hide: () => {
            if (this.tableTemplate.changedRows.length === 0) return true;
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
                  this.tableTemplate.changedRows = [];
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
              icon: 'fa fa-edit',
              data: {
                item: this._dataService.cloneItem(item)
              },
              title: 'EDIT ROUTE TO TEST',
              acceptCallback: item1 => {
                console.log(item1)
                this.routerService.editRouter(item1, () => {
                  this.getData();
                });
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
          lazyload: true,
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
          lazyload: true,
          executeAsync: () => {
            var itemCopy = this._dataService.cloneItems(this.tableTemplate.selectedItems);
            for (let index = 0; index < itemCopy.length; index++) {
              var element = itemCopy[index];

              if (element.name) {
                var checkCopy = this.data.filter(s => s.name && s.name.includes(element.name + '_copy') && s.name.length >= element.name.length + 5 && s.name.length <= element.name.length + 7);
              } else {
                var checkCopy = this.data.filter(s => s.name && s.name.includes('_copy') && s.name.length >= 5 && s.name.length <= 7);
              }

              element.name = element.name ? element.name + '_copy' + (checkCopy.length + 1) : '_copy' + (checkCopy.length + 1);
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
          title: () => 'Name',
          valueRef: () => 'name',
          allowFilter: true,
          validationOption: new ValidationOption({
            rules: [
              new RequiredValidationRule(),
              new CustomValidationRule((item) => {
                return this.routerService.validateName(item);
              })
            ]
          })
        },
        {
          type: TableColumnType.String,
          title: () => 'tags',
          valueRef: () => 'tags',
          allowFilter: true,
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
          valueRef: () => 'service_name',
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

  // private registerEvents():void {
  //   this.aggregatorService.subscribe('test', (response) => {
  //     this.aggregatorService.publish('test1','ok');
  //   });
  // }
}