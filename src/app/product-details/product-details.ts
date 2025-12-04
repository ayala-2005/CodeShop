import { Component,effect,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseDetailsService} from '../purchase-details-service'
import { PurchaseDetail} from '../models/purchase-detail'
import { Product} from '../models/product'

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
product: any;
customerId = JSON.parse(localStorage.getItem('currentUser') || '{}').customerId;
  toastVisible = signal(false);
  toastMessage = signal("");
constructor(private PurchaseDetailsService:PurchaseDetailsService){
      effect(() => {
      if (this.toastVisible()) {
        setTimeout(() => {
          this.toastVisible.set(false);
        }, 2500);
      }
    });
  
}
ngOnInit() {
  this.product = history.state.product;
}
showToast(message: string) {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
  }
addProduct(product: Product) {
    if (this.customerId) {
      this.PurchaseDetailsService
        .AddProductToPurchase(this.customerId, product.productId)
        .subscribe({
          next: () => {
            this.showToast("✔ המוצר נוסף לעגלה");
          },
          error: () => {
            this.showToast("המוצר כבר קיים בעגלה");
          }
        });

    } else {
      // local cart
      const raw = localStorage.getItem('cart');
      let localCart: PurchaseDetail[] = raw ? JSON.parse(raw) : [];

      const exists = localCart.some(p => p.productId === product.productId);

      if (!exists) {
        localCart.push({
          purchaseId: 0,
          productId: product.productId,
          product: product
        });

        localStorage.setItem('cart', JSON.stringify(localCart));
        this.showToast("✔ המוצר נוסף לעגלה");

      } else {
        this.showToast("המוצר כבר קיים בעגלה");
      }
    }
  }
}
