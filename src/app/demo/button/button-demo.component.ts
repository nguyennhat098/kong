import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidationRule, ClientValidator, ValidationOption, RequiredValidationRule, CustomValidationRule, ValidationRuleResponse, ValidationService, ModalService, TemplateViewModel, TableComponent, ConfirmViewModel, TableConstant, TableMode, TableColumnType, TableOption } from 'ngx-fw4c';
import { ButtonDemoService } from './button-demo.service';
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
export class item {
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
@Component({
  selector: 'button-demo',
  templateUrl: './button-demo.component.html',
  styleUrls: ['./button-demo.component.scss']
})

export class ButtonDemoComponent {
  @ViewChild("formRef", { static: true }) public formRef: ElementRef;
  item = new item;
  public option: TableOption;
  constructor(private http: HttpClient, private _validationService: ValidationService, private _modalService: ModalService,private _buttonService:ButtonDemoService) {

  }
  public validateNumber(number: string): Observable<ValidationRuleResponse> {
    let regex = /[0-9]*$/g;
    return of(new ValidationRuleResponse({
      status: regex.test(number),
      message: 'Please input only number'
    })).pipe(delay(500));
  }

  public validateString(string: string): Observable<ValidationRuleResponse> {
    let regex = /[A-Za-z0-9!#$%&'*+=?^_`{|}~-]/g;
    return of(new ValidationRuleResponse({
      status: regex.test(string),
      message: 'Please input right format'
    })).pipe(delay(500));
  }
  public validateProtocol(string: string): Observable<ValidationRuleResponse> {
    return of(new ValidationRuleResponse({
      status: string == 'grpc' || string == 'grpcs' || string == 'http' || string == 'https' || string == 'tcp' || string == 'tls',
      message: 'expected one of: grpc, grpcs, http, https, tcp, tls'
    })).pipe(delay(500));
  }
  public validateURL(url: string): Observable<ValidationRuleResponse> {
    return of(new ValidationRuleResponse({
      status: url.startsWith('/', 0),
      message: 'should start with: /'
    })).pipe(delay(500));
  }
  
  ngAfterViewInit() {
    this.initValidations();
  }

  public isValid(): boolean {
    return this._validationService.isValid(false);
  }
  private initValidations(): void {
    var options = [
      new ValidationOption({
        validationName: "name",
        valueResolver: () => this.item.name,
        rules: [
          new RequiredValidationRule(),
          new CustomValidationRule((value, payload) => {
            return this.validateString(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "Tag",
        valueResolver: () => this.item.tags,
        rules: [
          new CustomValidationRule((value, payload) => {
            return this.validateString(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "URL",

        valueResolver: () => this.item.url,
        relevantFields: () => ['path'],
        // payloadRef: () => this.item.path,
        rules: [
          new CustomValidationRule(value => {
            return (
              this.validateString(value)
            );
          })

        ]
      }),
      new ValidationOption({
        validationName: "protocol",
        valueResolver: () => this.item.protocol,
        rules: [
          new CustomValidationRule(value => {
            return this.validateProtocol(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "host",
        valueResolver: () => this.item.host,
        rules: [
          new RequiredValidationRule(),
          new CustomValidationRule((value, payload) => {
            return of(new ValidationRuleResponse({
              status: isNaN(value),
              message: 'Please input right format'
            })).pipe(delay(500));
          })
        ]
      }),
      new ValidationOption({
        validationName: "port",
        valueResolver: () => this.item.port,
        rules: [
          new CustomValidationRule((value, payload) => {
            return this.validateNumber(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "Retries",
        valueResolver: () => this.item.Retries,
        rules: [
          new CustomValidationRule((value, payload) => {
            return this.validateString(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "Connect",
        valueResolver: () => this.item.Connect,
        rules: [
          new CustomValidationRule((value, payload) => {
            return this.validateNumber(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "Write",
        valueResolver: () => this.item.Write,
        rules: [
          new CustomValidationRule((value, payload) => {
            return this.validateNumber(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "Read",
        valueResolver: () => this.item.Read,
        rules: [
          new CustomValidationRule((value, payload) => {
            return this.validateNumber(value);
          })
        ]
      }),
      new ValidationOption({
        validationName: "path",
        valueResolver: () => this.item.path,
        rules: [
          new RequiredValidationRule(),
          new CustomValidationRule((value, payload) => {
            return this.validateURL(value);
          }),
          new CustomValidationRule(value => {
            console.log(this.item.url)

            debugger;
            return of(new ValidationRuleResponse({
              status: !this.item.url,
              message: 'The path to be used in requests to the upstream server. Empty by default.'
            })).pipe(delay(500));
          })
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
  PostService() {
    console.log(this.item)
    return this.http.post<item>('http://192.168.66.49:8001/services', this.item, httpOptions).subscribe(data => {
    });
  }

 

}
