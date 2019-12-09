import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RouteViewModel, RouteSearchResponse, RouteModelMapping } from '../routes.model';
import { ServiceViewModel } from 'src/app/service/router.service';
import { ValidationService, ActionService, ValidationOption, CustomValidationRule, RequiredValidationRule, ValidationRuleResponse, ClientValidator } from 'ngx-fw4c';
import { RoutesManagementService } from '../routes-management.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-routes.component.html',
  styleUrls: ['./edit-routes.component.scss']
})
export class EditRouteComponent implements OnInit {
  @Input() public item: RouteViewModel;
  service = new ServiceViewModel;
  services: string[];
  data = [];
  @ViewChild("formRef", { static: true }) public formRef: ElementRef;

  constructor(
    private _validationService: ValidationService,
    protected actionService: ActionService,
    private _routerService: RoutesManagementService) { }

  getData(): void {
    this._routerService.search(new RouteSearchResponse()).subscribe((res: any) => {
      this.data = res.items;
      if (this.item.name) {
        this.data = this.data.filter(item => item.name !== this.item.name);
      }
    });
  }

  ngOnInit() {
    this.getData();
    this._routerService.serviceList().subscribe((res: any) => {
      this.services = res;
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
            var regex = new RegExp("^[a-zA-Z0-9_\.\~\-]*$");
            return of(new ValidationRuleResponse({
              status: regex.test(value) || value == null,
              message: 'wrong format.'
            }));
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
            var regex = new RegExp("^[a-zA-Z0-9.-~]*$");
            var data = value.filter(x => x && !regex.test(x));
            return of(new ValidationRuleResponse({
              status: data.length < 1,
              message: 'wrong format.'
            }))
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
            var regex = new RegExp("^[a-zA-Z0-9.\~\-]*$");
            var data = value.filter(x => x && !x.startsWith('/', 0) && regex.test(x));
            return of(new ValidationRuleResponse({
              status: data.length < 1,
              message: 'A list of paths that match this Route. For example: /my-path. At least one of hosts, paths, or methods must be set.'
            }));
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Method",
        valueResolver: () => this.item.methods,
        rules: [
          new CustomValidationRule(value => {
            var value = value.filter(x => x && !(['GET', 'PUT', 'POST', 'DELETE'].indexOf(x) > -1));
            return of(new ValidationRuleResponse({
              status: value.length < 1,
              message: 'A list of HTTP methods that match this Route. At least one of hosts, paths, or methods must be set.'
            }));
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Protocols",
        valueResolver: () => this.item.protocols,
        rules: [
          new CustomValidationRule(value => {
            var data = value.filter(x => x && !(['http', 'https'].indexOf(x) > -1));
            return of(new ValidationRuleResponse({
              status: data.length < 1,
              message: 'A list of the protocols this Route should allow. By default it is ["http", "https"], which means that the Route accepts both. When set to ["https"], HTTP requests are answered with a request to upgrade to HTTPS.'
            }));
          }),
        ]
      }),
      new ValidationOption({
        validationName: "Host",
        valueResolver: () => this.item.hosts,
        rules: [
          new CustomValidationRule(value => {
            var regex = new RegExp("^[a-zA-Z0-9]*$");
            var regexNumber = new RegExp("^[0-9]*$");
            var value = value.filter(x => x && !(regex.test(x) && !regexNumber.test(x)));
            return of(new ValidationRuleResponse({
              status: value.length < 1,
              message: 'A list of domain names that match this Route. For example: example.com. At least one of hosts, paths, or methods must be set.'
            }));
          }),
        ]
      }),
      new ValidationOption({
        validationName: "statusCode",
        valueResolver: () => this.item.statusCode,
        rules: [
          new CustomValidationRule(value => {
            return of(new ValidationRuleResponse({
              status: value == 426 || value == 301 || value == 302 || value == 307 || value == 308,
              message: 'Https redirect status code expected one of: 426, 301, 302, 307, 308.'
            }));
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
    var stripString = (String)(this.item.stripPath);
    var preserveHostString = (String)(this.item.preserveHost);
    this.item.stripPath = stripString === null || stripString == 'true' ? true : false;
    this.item.preserveHost = preserveHostString === null || preserveHostString == 'false' ? false : true;
    this.item.name = !this.item.name ? null : this.item.name;
    var currentItem = new RouteModelMapping({
      hosts: this.item.hosts,
      methods: this.item.methods,
      name: this.item.name,
      paths: this.item.paths,
      preserve_host: this.item.preserveHost,
      regex_priority: this.item.regexPriority ? +this.item.regexPriority : 0,
      https_redirect_status_code: this.item.statusCode ? +this.item.statusCode : 426,
      protocols: this.item.protocols,
      service: this.item.service,
      strip_path: this.item.stripPath,
      tags: this.item.tags,
      id: this.item.id
    });
    return of(currentItem);
  }
}
