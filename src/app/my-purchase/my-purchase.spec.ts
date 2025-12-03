import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPurchase } from './my-purchase';

describe('MyPurchase', () => {
  let component: MyPurchase;
  let fixture: ComponentFixture<MyPurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPurchase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPurchase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
