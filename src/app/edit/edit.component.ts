import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ValidationOption, RequiredValidationRule, ValidationService, ClientValidator, ActionService, CustomValidationRule, ValidationRule, ValidationRuleResponse, AggregatorService } from 'ngx-fw4c';
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
    private aggregatorService: AggregatorService,
    private routerService: RouterService) { }

  getData(): void {
    this.routerService.search(999).subscribe((res: any) => {
      this.data = res;
      if (this.item.name) {
        this.data = this.data.filter(item => item.name !== this.item.name);
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
console.log(this.item)
    });

    this.initValidations();

    // setTimeout(() => {
    //   this.aggregatorService.publish('test', { name: 'testing' });
    // }, 4000);

    // this.aggregatorService.subscribe('test1', (res) => {
    //   debugger
    // });
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
            var checkData = this.data.find(x => x.name == value);
            return of(new ValidationRuleResponse({
              status: !checkData,
              message: 'Name must be unique'
            }));
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Tags",
        valueResolver: () => this.item.tags,
        rules: [
          new CustomValidationRule(value => {
            return this.routerService.validateTag(value);
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
    var data = new RouterViewModel();
    data.hosts = this.item.hosts? this.item.hosts:null;
    data.https_redirect_status_code = this.item.https_redirect_status_code;
    data.methods = this.item.methods?this.item.methods:null;
    data.paths = this.item.paths?this.item.paths:null;
    data.protocols = this.item.protocols;
    data.service = this.item.service;
    data.tags = this.item.tags;
    data.strip_path = stripString===null || stripString == 'true' ? this.item.strip_path = true : this.item.strip_path = false;
    data.preserve_host = preserveHostString === null || preserveHostString == 'false' ? this.item.preserve_host = false : this.item.preserve_host = true;
    data.name = !this.item.name?  null : this.item.name;
    data.id= this.item.id;
    return of(data);
  }
}
