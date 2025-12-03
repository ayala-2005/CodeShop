import { Component, OnInit } from '@angular/core';
import { ShoppingCartServise } from '../shopping-cart-servise';
import { PurchaseDetailsService } from '../purchase-details-service';
import { signal } from '@angular/core';
import { Purchase } from '../models/purchase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-purchase',
  templateUrl: './my-purchase.html',
  imports: [CommonModule],
  styleUrls: ['./my-purchase.css'],
})
export class MyPurchase implements OnInit {
  purchases = signal<Purchase[]>([]);
  loading = signal(true);
  error = signal(false);
  customerId: number | null = null;

  // ✅ הוספה למודאל
  showModal = signal(false);
  selectedPurchaseDetails = signal<any>(null);
  loadingDetails = signal(false);

  constructor(private ShoppingCartServise: ShoppingCartServise, private PurchaseDetailsService:PurchaseDetailsService) {}

  ngOnInit() {
    setTimeout(() => {
      const currentUser = localStorage.getItem('currentUser');
      
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          this.customerId = user.customerId;
          
          if (this.customerId) {
            this.loadPurchases();
          } else {
            this.loading.set(false);
            this.error.set(true);
          }
        } catch (e) {
          console.error('Error parsing user:', e);
          this.loading.set(false);
          this.error.set(true);
        }
      } else {
        this.loading.set(false);
        this.error.set(true);
      }
    }, 100);
  }

  loadPurchases() {
    if (!this.customerId) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.ShoppingCartServise.GetClosedPurchases(this.customerId).subscribe({
      next: (data) => {
        this.purchases.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading purchases:', err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  // ✅ פתיחת המודאל עם פרטי הזמנה
  openPurchaseDetails(purchaseId: number) {
  this.showModal.set(true);
  this.loadingDetails.set(true);
  this.selectedPurchaseDetails.set(null);

  this.PurchaseDetailsService.GetProductsByPurchaseId(purchaseId).subscribe({
    next: (details) => {
      console.log('Purchase details received:', details); // ✅ הוספנו לוג
      this.selectedPurchaseDetails.set(details);
      this.loadingDetails.set(false);
    },
    error: (err) => {
      console.error('Error loading purchase details:', err);
      this.loadingDetails.set(false);
      alert('שגיאה בטעינת פרטי ההזמנה');
      this.showModal.set(false);
    }
  });
}

  // ✅ סגירת המודאל
  closeModal() {
    this.showModal.set(false);
    this.selectedPurchaseDetails.set(null);
  }
}