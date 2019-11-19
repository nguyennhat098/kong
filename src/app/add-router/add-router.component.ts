import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ValidationOption, ClientValidator, RequiredValidationRule, ValidationService, ValidationRuleResponse, CustomValidationRule } from 'ngx-fw4c';
import { item } from '../demo';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { callbackify } from 'util';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  selector: 'app-add-router',
  templateUrl: './add-router.component.html',
  styleUrls: ['./add-router.component.scss']
})
export class AddRouterComponent implements OnInit {
  item = new Router;
  service = new Service;
  @ViewChild("formRef", { static: true }) public formRef: ElementRef;
  constructor(private _validationService: ValidationService, private http: HttpClient) { }
  services: string[];

  callback(): Observable<any> {
    this.item.service = this.service;
    return of(this.item);
  }

  ngOnInit() {
    this.http.get('http://192.168.35.108:8001/services').subscribe((res: any) => {
      this.services = res.data;
      this.services.unshift('');
    })
    this.initValidations();
  }

  public validateURL(url: string): Observable<ValidationRuleResponse> {
    return of(new ValidationRuleResponse({
      status: url.startsWith('/', 0),
      message: 'should start with: /'
    })).pipe(delay(500));
  }
  public isValid(): boolean {
    if (this._validationService.isValid(false, true)) {
      return true;
    }
    return false;
  }
  private initValidations(): void {
    var options = [
      // new ValidationOption({
      //   validationName: "service",
      //   valueResolver: () => this.service.id,
      //   rules: [
      //     new RequiredValidationRule(),
      //   ]
      // }),
    ];
    var validator = new ClientValidator({
      formRef: this.formRef,
      options: options,
      payloadRef: () => this.item
    });
    this._validationService.init({ validator });

  }

  onChange(data: string) {
    this.service.id = data;
  }
}
