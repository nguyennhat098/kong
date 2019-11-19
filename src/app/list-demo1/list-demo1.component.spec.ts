import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDemo1Component } from './list-demo1.component';

describe('ListDemo1Component', () => {
  let component: ListDemo1Component;
  let fixture: ComponentFixture<ListDemo1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDemo1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDemo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
