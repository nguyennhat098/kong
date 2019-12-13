import { Component, OnInit, ViewChild, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { TableComponent, TableOption, ModalService, DataService, AggregatorService, TemplateViewModel, ConfirmViewModel, TableConstant, TableMode, TableColumnType, ValidationOption, RequiredValidationRule, CustomValidationRule, ValidationRuleResponse, KeyConst } from 'ngx-fw4c';

import { IgxExcelExporterService } from 'igniteui-angular';
import { RouteViewModel, ServiceViewModel, RouteSearchResponse, RouteSearchRequest, RouteModelMapping } from '../routes.model';
import { EditRouteComponent } from '../edit/edit-routes.component';
import { of } from 'rxjs';
import { ExportRoutesComponent } from '../export/export-routes.component';
import { RoutesManagementService } from '../routes-management.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list-routes.component.html',
  styleUrls: ['./list-routes.component.scss']
})
export class RouteListComponent implements OnInit {
  @ViewChild('tableTemplate', { static: true }) public tableTemplate: TableComponent;
  // @ViewChild('imageTemplate', { static: true }) public imageTemplate: TemplateRef<any>;
  @ViewChild('serviceTemplate',{static: true}) public serviceTemplate: TemplateRef<any>
  
  public option: TableOption;
  data = [];
  constructor(private _modalService: ModalService,
    private _routerService: RoutesManagementService,
    private _dataService: DataService,
    protected aggregatorService: AggregatorService) { }

  ngOnInit(): void {
    this._routerService.search(new RouteSearchResponse()).subscribe((res: any) => {
      this.data = res.items;
      this.tableTemplate.reload();
    });
    this.initTable();
    this.registerEvents();
  }
  importExcel(items) {
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      var service = new ServiceViewModel({ id: element.service });
      var item = new RouteModelMapping({
        hosts: element.hosts ? element.hosts.split(',') : [],
        https_redirect_status_code: element.statusCode,
        methods: element.methods ? element.methods.split(',') : [],
        name: element.name,
        paths: element.paths ? element.paths.split(',') : [],
        preserve_host: element.preserveHost == 'true' ? true : false,
        protocols: element.protocols ? element.protocols.split(',') : [],
        regex_priority: element.regexPriority,
        service: service,
        strip_path: element.stripPath == 'true' ? true : false,
        tags: element.tags ? element.tags.split(',') : []
      });
      this._routerService.add(item, new RouteSearchRequest).subscribe(() => {
        if (index == items.length - 1) {
          this.tableTemplate.reload();
        }
      })
    }
  }

  private initTable() {
    this.option = new TableOption({
      localData: () => {
        return this._routerService.search(new RouteSearchResponse()).pipe(map((r: any) => r.items));
      },
      topButtons: [
        {
          icon: 'fa fa-plus',
          customClass: 'primary',
          title: () => 'New',
          executeAsync: () => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: EditRouteComponent,
              customSize: 'modal-lg',
              title: 'ADD ROUTE TO TEST',
              icon: 'fa fa-plus',
              validationKey: 'AddRouterComponent',
              data: {
                item: new RouteViewModel()
              },
              acceptCallback: item => {
                this._routerService.add(item, new RouteSearchRequest).subscribe(() => {
                  this.tableTemplate.reload();
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
            this._modalService.showTemplateDialog(new TemplateViewModel({
              template: ExportRoutesComponent,
              icon: 'fa fa-print',
              title: 'File',
              validationKey: 'ExportRoutesComponent',
              acceptCallback: data => {
                if (data == 'exportExcel') {
                  this._routerService.exportExcel(this.data);
                }
                if (data == 'exportPdf') {
                  this._routerService.exportPdf(this.data);
                }
                if (data == 'template') {
                  this._routerService.exportTemplateExcel();
                }
                if (data && Array.isArray(data)) {
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
              var currentItem = new RouteModelMapping({
                name: element.name,
                service: element.service,
                strip_path: element.stripPath,
                hosts: element.hosts,
                https_redirect_status_code: element.statusCode,
                id: element.id,
                methods: element.methods,
                paths: element.paths,
                preserve_host: element.preserveHost,
                protocols: element.protocols,
                regex_priority: element.regexPriority,
                tags: element.tags,
              });
              this._routerService.edit(currentItem, new RouteSearchRequest).subscribe(() => {
                if (index == items.length - 1) {
                  this.tableTemplate.resetChanges();
                  this.tableTemplate.reload();
                }
              })
            }
          }
        }
      ],
      actions: [
        {
          icon: 'fa fa-edit',
          customClass:'primary',
          executeAsync: (item: RouteViewModel) => {
            this._modalService.showTemplateDialog(new TemplateViewModel({
              customSize: 'modal-lg',
              template: EditRouteComponent,
              validationKey: 'EditRouteComponent',
              icon: 'fa fa-edit',
              data: {
                item: this._dataService.cloneItem(item)
              },
              title: 'EDIT ROUTE TO TEST',
              acceptCallback: item1 => {
                this._routerService.edit(item1, new RouteSearchRequest).subscribe(() => {
                  this.tableTemplate.reload();
                });
              }
            }))
          }
        },
        {
          icon: 'fa fa-remove',
          customClass:'danger',
          executeAsync: (item: any) => {
            this._modalService.showConfirmDialog(new ConfirmViewModel({
              title: 'Delete',
              message: 'Are you sure?',
              btnAcceptTitle: 'Ok',
              acceptCallback: () => {
                this._routerService.delete(item, new RouteSearchRequest).subscribe(() => {
                  this.tableTemplate.reload();
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
                  this._routerService.delete(element, new RouteSearchRequest).subscribe(() => {
                    if (index == data.length - 1) {
                      this.tableTemplate.reload();
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
              var currentItem = new RouteModelMapping({
                hosts: element.hosts,
                methods: element.methods,
                name: element.name,
                paths: element.paths,
                preserve_host: element.preserveHost,
                regex_priority: element.regexPriority,
                https_redirect_status_code: element.statusCode,
                protocols: element.protocols,
                service: element.service,
                strip_path: element.stripPath,
                tags: element.tags,
                id: element.id
              });
              this.data.push(element);
              this._routerService.add(currentItem, new RouteSearchRequest).subscribe(res => {
                if (index == itemCopy.length - 1) {
                  this.tableTemplate.reload();
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
              new CustomValidationRule((value) => {
                var regex = new RegExp("^[a-zA-Z0-9_\.\~\-]*$");

                return of(new ValidationRuleResponse({
                  status: regex.test(value) || value == null,
                  message: 'wrong format.'
                }));
              })
            ]
          })
        },
        {
          type: TableColumnType.String,
          title: () => 'tags',
          valueRef: () => 'tags',
          allowFilter: true,
          editInline:false
        },
        {
          type: TableColumnType.String,
          title: () => 'hosts',
          valueRef: () => 'hosts',
          allowFilter: true,
          editInline:false
        },
        {
          type: TableColumnType.String,
          title: () => 'service',
          valueRef: () => 'serviceName',
          customTemplate: ()=> this.serviceTemplate,
          allowFilter: false,
          editInline:false
        },
        {
          type: TableColumnType.String,
          title: () => 'paths',
          valueRef: () => 'paths',
          allowFilter: true,
          editInline:false
        }
      ],
      serviceProvider: {
        searchAsync: request => {
          return of(true);
        }
      }
    });
  }
  private registerEvents(): void {
		this.aggregatorService.subscribe(KeyConst.Search, (response: any) => {
			var filter = response.keyword;
			this.tableTemplate.setFilter('searchText', filter);
			this.tableTemplate.reload(true).subscribe();
		});

		this.aggregatorService.subscribe(KeyConst.KeywordChanged, (response: any) => {
			console.log(response.keyword);
			var filter = response.keyword;
			this.tableTemplate.setFilter('searchText', filter);
			this.tableTemplate.reload(true).subscribe();

		});
	}
}
