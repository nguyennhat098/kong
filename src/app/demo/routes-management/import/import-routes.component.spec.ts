import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRoutesComponent } from './import-routes.component';

describe('ImportRoutesComponent', () => {
  let component: ImportRoutesComponent;
  let fixture: ComponentFixture<ImportRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
