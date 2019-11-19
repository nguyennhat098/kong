import { TestBed } from '@angular/core/testing';

import { ButtonDemoService } from './button-demo.service';

describe('ButtonDemoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButtonDemoService = TestBed.get(ButtonDemoService);
    expect(service).toBeTruthy();
  });
});
