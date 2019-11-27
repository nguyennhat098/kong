import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ValidationOption, RequiredValidationRule, ValidationService, ClientValidator, ActionService, CustomValidationRule, ValidationRule, ValidationRuleResponse } from 'ngx-fw4c';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { RouterService, RouterViewModel, ServiceViewModel } from '../service/router.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Input() public item: RouterViewModel;
  service = new ServiceViewModel;
  services: string[];
  data = [];
  @ViewChild("formRef", { static: true }) public formRef: ElementRef;
  constructor(
    private _validationService: ValidationService,
    protected actionService: ActionService,
    private http: HttpClient,
    private routerService: RouterService) { }

    getData(): void {
      this.data = [];
      this.http.get('http://localhost:8001/routes').subscribe((res: any) => {
        for (let index = 0; index < res.data.length; index++) {
  
          this.data.push(res.data[index]);
  
        }
  
  
      });
    }
  ngOnInit() {
    this.getData();
    this.http.get('http://localhost:8001/services').subscribe((res: any) => {
      this.services = res.data;
      if (this.item.service == null) {
        this.services.unshift('');
      }
    });

    this.initValidations();

  }
  private initValidations(): void {
    var options = [
      new ValidationOption({
        validationName: "Name",
        valueResolver: () => this.item.name,
        rules: [
          new CustomValidationRule(value => {
            return this.routerService.validateName(value);
          }),
          new CustomValidationRule(value => {
            var item=this.data.find(x=>x.name==value);
            return of(new ValidationRuleResponse({
              status:!item,
              message:'Name must be unique'
            }));
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Tags",
        valueResolver: () => this.item.name,
        rules: [
          new CustomValidationRule(value => {
            return this.routerService.validateName(value);
          }),
        ]
      }),
      new ValidationOption({
        validationName: "service",
        valueResolver: () => this.item.service,
        rules: [
          new RequiredValidationRule(),
        ]
      }),
      new ValidationOption({
        validationName: "paths",
        valueResolver: () => this.item.paths,
        rules: [
          new RequiredValidationRule(),
          new CustomValidationRule(value => {
            return this.routerService.validateURL(value);
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Method",
        valueResolver: () => this.item.methods,
        rules: [
          new CustomValidationRule(value => {
            return this.routerService.validateMethod(value);
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Protocols",
        valueResolver: () => this.item.protocols,
        rules: [
          new CustomValidationRule(value => {
            return this.routerService.validateProtocol(value);
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Host",
        valueResolver: () => this.item.hosts,
        rules: [
          new CustomValidationRule(value => {
            return this.routerService.validateHost(value);
          }),
        ]
      }),
      new ValidationOption({
        validationName: "StatusCode",
        valueResolver: () => this.item.https_redirect_status_code,
        rules: [
          new CustomValidationRule(value => {
            // this._validationService.isDirty((items) => {

            // });
            return this.routerService.validateStatusCode(value);
          }),
        ]
      }),
    ];
    var validator = new ClientValidator({
      formRef: this.formRef,
      options: options,
      payloadRef: () => this.item
    });
    this._validationService.init({ validator });

  }
  onChange(data: string) {
    var currentItem: ServiceViewModel = { id: data };
    this.item.service = currentItem;
  }
  public getValidator(): ValidationService {
    return this._validationService;
  }

  public isValid(): boolean {
    return this._validationService.isValid(true, false);
  }

  public callback(): Observable<any> {
    var stripString = (String)(this.item.strip_path);
    var preserveHostString = (String)(this.item.preserve_host);
    this.item.strip_path = stripString === "undefined" || this.item.strip_path === null || stripString == 'true' ? this.item.strip_path = true : this.item.strip_path = false;
    this.item.preserve_host = preserveHostString === "undefined" || this.item.preserve_host === null || preserveHostString == 'false' ? this.item.preserve_host = false : this.item.preserve_host = true;
    this.item.name = this.item.name == '' ? this.item.name = null : this.item.name = this.item.name;
    return of(this.item);
  }
}
