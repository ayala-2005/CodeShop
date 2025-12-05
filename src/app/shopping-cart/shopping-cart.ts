// shopping-cart.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { PurchaseDetailsService } from '../purchase-details-service';
import { ShoppingCartServise } from '../shopping-cart-servise';
import { PurchaseDetail } from '../models/purchase-detail';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  totalPrice = signal<number>(0);
  imagesUrl = 'https://localhost:7272/images/';


  constructor(private purchaseDetailsService: PurchaseDetailsService,private ShoppingCartServise: ShoppingCartServise,private router: Router) { }

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
    this.calculateTotal();

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
          this.calculateTotal();
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
calculateTotal() {
  // אם משתמש מחובר
  if (this.customerId) {
    this.purchaseDetailsService.GetOpenPurchase(this.customerId).subscribe({
      next: (data) => {
        this.totalPrice.set(data.totalAmount); // לוודא שזה השם מהשרת
      },
      error: (err) => {
        console.error('שגיאה בטעינת הקנייה:', err);
      }
    });
  } 
  // אם משתמש לא מחובר → חישוב מה-localStorage
  else {
    const localCartRaw = localStorage.getItem('cart');

    if (!localCartRaw) {
      this.totalPrice.set(0);
      return;
    }

    const localCart = JSON.parse(localCartRaw);

    const total = localCart.reduce((sum: number, item: any) => {
      const price = item.product?.price ?? 0;   // אם המודל כולל product
      const quantity = item.quantity ?? 1;
      return sum + price * quantity;
    }, 0);

    this.totalPrice.set(total);
  }
}
notLoggedInMessage = signal(false);

 goToCheckout() {
  if (!this.customerId) {
    this.notLoggedInMessage.set(true);
    return;
  }

  this.ShoppingCartServise.ClosePurchase(this.customerId)
    .subscribe({
      next: (purchase) => {
        // נניח ש-purchase הוא מסוג PurchaseDTO
        const purchaseId = purchase.purchaseId;

        // שליחה לדף 'order-complete' עם ה-ID כפרמטר
        this.router.navigate(['/order-complete'], {
  state: { 
    purchaseId: purchase.purchaseId,
    totalAmount: purchase.totalAmount
  }
});

      },
      error: (err) => {
        console.error('שגיאה בסגירת הקנייה:', err);
      }
    });
}
continueShopping() {
  this.router.navigate(['/menu']);
}
}