import { TestBed } from '@angular/core/testing';

import { ListDemoService } from './list-demo.service';

describe('ListDemoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListDemoService = TestBed.get(ListDemoService);
    expect(service).toBeTruthy();
  });
});
