import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ValidationService, ValidationOption, RequiredValidationRule, CustomValidationRule, ClientValidator, ValidationRuleResponse } from 'ngx-fw4c';
import { of } from 'rxjs';

@Component({
  selector: 'validation-demo',
  templateUrl: './validation-demo.component.html'
})

export class ValidationDemoComponent implements AfterViewInit {
  public data: string;
  @ViewChild('formRef', { static: true }) public formRef: ElementRef;

  constructor(
    private _validationService: ValidationService
  ) { }

  ngAfterViewInit(): void {
    this.initValidations();
  }

  private initValidations(): void {
    var options = [
      new ValidationOption({
        validationName: 'Name',
        valueResolver: () => this.data,
        rules: [
          new RequiredValidationRule(),
          new CustomValidationRule((value, payload) => {
            if (!value) return of(new ValidationRuleResponse({
              status:true
            }));
          })
        ]
      })
    ];

    var validator = new ClientValidator({
      formRef: this.formRef,
      options: options
    });

    this._validationService.init({ validator });
  }
}
