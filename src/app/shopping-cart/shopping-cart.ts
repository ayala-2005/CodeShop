// shopping-cart.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { PurchaseDetailsService } from '../purchase-details-service';
import { PurchaseDetail } from '../models/purchase-detail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ShoppingCart implements OnInit {
  list = signal<PurchaseDetail[]>([]);
  loading = signal<boolean>(true);
  customerId: number | undefined;

  constructor(private purchaseDetailsService: PurchaseDetailsService) { }

  ngOnInit() {
    const user = localStorage.getItem('currentUser');

    if (user) {
      // משתמש מחובר - טען מהשרת
      this.customerId = JSON.parse(user).customerId;
      this.loadProductsCart();
    } else {
      // לא מחובר - טען מ-localStorage
      this.loadLocalCart();
    }
  }

  loadProductsCart() {
    if (!this.customerId) return;

    this.purchaseDetailsService.GetCartProducts(this.customerId).subscribe({
      next: (data: PurchaseDetail[]) => {
        console.log("נתונים מהשרת:", data);
        this.list.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('שגיאה בטעינת העגלה:', err);
      }
    });
  }

  loadLocalCart() {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      this.list.set(JSON.parse(localCart));
    }
    this.loading.set(false);
  }
  removeFromCart( productId: number) {
  if (this.customerId) {
    // משתמש מחובר → שלח לשרת
    this.purchaseDetailsService.RemoveProduct(this.customerId, productId).subscribe({
      next: (res) => {
        console.log('המוצר נמחק בהצלחה מהשרת', res);
        this.loadProductsCart();
      },
      error: (err) => {
        console.error('שגיאה במחיקת המוצר מהשרת:', err);
      }
    });
  } else {
    // משתמש לא מחובר → הסרה מה-localStorage
    const localCartRaw = localStorage.getItem('cart');
    if (localCartRaw) {
      let localCart: PurchaseDetail[] = JSON.parse(localCartRaw);
      localCart = localCart.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(localCart));
      this.list.set(localCart); // עדכון ה-UI
      console.log('המוצר נמחק מהעגלה המקומית', productId);
    }
  }
}


}