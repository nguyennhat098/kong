import { Component, OnInit, Input } from '@angular/core';
import { Service, ServiceResponse, ServiceUpdateRequest } from '../../service-management/service.model';
import { ServiceManagementService } from '../../service-management/service-management.service';
import { ModalService, TemplateViewModel } from 'ngx-fw4c';
import { ServiceTemplateComponent } from '../../service-management/service-template';

@Component({
  selector: 'service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.scss']
})
export class ServiceInfoComponent implements OnInit {
  @Input() public id: string;
  public item: Service;

  constructor(private _service: ServiceManagementService,private _modalService: ModalService) { }

  ngOnInit() {
    this.getItem();
  }

  private getItem(): void {
    this._service.getById(this.id).subscribe((response: ServiceResponse) => {
      this.item = response.service;
    });
  }
 public  show(name){
   console.log(name);
  this._modalService.showTemplateDialog(new TemplateViewModel({
    validationKey: 'ServiceTemplateComponent',
    icon: 'fa fa-edit',
    data: {
      item: this.item,
      action: 'Edit'
    },
    customSize: 'modal-lg',
    template: ServiceTemplateComponent,
    title: 'ServiceTemplateComponent',
    btnAcceptTitle: 'accept',
    btnCancelTitle:'cancel',
    acceptCallback: (response: any, close, provider: any) => {
        this._service.updateService(provider.item, new ServiceUpdateRequest({}))
        .subscribe();
    }
  }))
  }
}
