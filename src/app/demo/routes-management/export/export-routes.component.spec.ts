import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRoutesComponent } from './export-routes.component';

describe('ExportRoutesComponent', () => {
  let component: ExportRoutesComponent;
  let fixture: ComponentFixture<ExportRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
