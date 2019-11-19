import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ValidationOption, RequiredValidationRule, ValidationService, ClientValidator, ActionService } from 'ngx-fw4c';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class Router {
  name: string;
  tags: string;
  hosts: string[];
  paths: string[];
  https_redirect_status_code: number;
  regex_priority: number;
  Methods: string[];
  strip_path: boolean;
  preserve_host: boolean;
  protocols: string[];
  service: Service
}
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
  id?: string;
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
 
  @Input() public Item: Router;
  service = new Service;
  @ViewChild("formRef", { static: true }) public formRef: ElementRef;
  constructor(
    private _validationService: ValidationService,
    protected actionService: ActionService,
    private http: HttpClient) { }
  services: string[];

  callback(): Observable<any> {
    this.Item.strip_path.valueOf()==true? this.Item.strip_path=true:this.Item.strip_path=false;
    this.Item.service = this.service;
    return of(this.Item);
  }
  ngOnInit() {
    this.http.get('http://192.168.35.108:8001/services').subscribe((res: any) => {
      this.services = res.data;
    })
    this.initValidations();
   console.log(this.Item)
  }

  public isValid(): boolean {
    if (this._validationService.isValid(false, true)) {
      return true;
    }
    return false;
  }

  private initValidations(): void {
    var options = [
      new ValidationOption({
        validationName: "service",
        valueResolver: () => this.service.id,
        rules: [
          new RequiredValidationRule(),
        ]
      }),


    ];
    var validator = new ClientValidator({
      formRef: this.formRef,
      options: options,
      payloadRef: () => this.Item
    });
    this._validationService.init({ validator });

  }
  onChange(data: string) {
    this.service.id = data;
  }
}
