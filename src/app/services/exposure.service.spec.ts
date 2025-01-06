import { TestBed } from '@angular/core/testing';

import { ExposureService } from './exposure.service';

describe('ExposureService', () => {
  let service: ExposureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExposureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
