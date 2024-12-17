import { TestBed } from '@angular/core/testing';

import { CongressService } from './congress.service';

describe('CongressService', () => {
  let service: CongressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
