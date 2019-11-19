import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRouterComponent } from './add-router.component';

describe('AddRouterComponent', () => {
  let component: AddRouterComponent;
  let fixture: ComponentFixture<AddRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
