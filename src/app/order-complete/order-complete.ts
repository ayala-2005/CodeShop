import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { PurchaseDetail } from '../models/purchase-detail';
import { PurchaseDetailsService } from '../purchase-details-service';
import { Router } from '@angular/router';
import { Purchase } from '../models/purchase';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './order-complete.html',
  styleUrls: ['./order-complete.css'],
})
export class OrderComplete {
  purchase: Purchase = { purchaseId: 0, customerId: 0, purchaseDate: new Date(), totalAmount: 0, note: '' };
  products = signal<PurchaseDetail[]>([]);
  totalAmount = signal<number>(0);
  loading = signal<boolean>(true);

  constructor(
    private router: Router,
    private purchaseDetailsService: PurchaseDetailsService
  ) {}

  ngOnInit(): void {
    // קבלת ה-state מהניווט
    const state = history.state;
    if (!state.purchaseId) {
      console.error('No purchase ID found');
      this.loading.set(false);
      return;
    }

    this.purchase.purchaseId = state.purchaseId;
    this.purchase.totalAmount = state.totalAmount ?? 0;
    this.totalAmount.set(this.purchase.totalAmount);

    // קריאה ל-service לקבלת פרטי הקניה
    this.purchaseDetailsService.GetPurchaseDetails(this.purchase.purchaseId)
      .subscribe({
        next: (data: PurchaseDetail[]) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading purchase details:', err);
          this.loading.set(false);
        }
      });
  }


  goToMenu() {
  this.router.navigate(['/menu']);
}
}
