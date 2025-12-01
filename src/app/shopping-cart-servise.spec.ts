import { TestBed } from '@angular/core/testing';

import { ShoppingCartServise } from './shopping-cart-servise';

describe('ShoppingCartServise', () => {
  let service: ShoppingCartServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCartServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
