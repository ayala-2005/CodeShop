import { TestBed } from '@angular/core/testing';

import { CodeShopService } from './CodeShopService';

describe('Service', () => {
  let service: CodeShopService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeShopService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
