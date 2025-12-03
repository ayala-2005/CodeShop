import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { PurchaseDetail } from '../models/purchase-detail';
import { PurchaseDetailsService } from '../purchase-details-service';
import { Router } from '@angular/router';
import { Purchase } from '../models/purchase';
import { Product } from '../models/product';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './order-complete.html',
  styleUrls: ['./order-complete.css'],
})
export class OrderComplete {
  purchase: Purchase = { 
    purchaseId: 0, 
    customerId: 0, 
    purchaseDate: '', 
    totalAmount: 0, 
    note: '', 
    isOpen: false 
  };
  products = signal<Product[]>([]);
  totalAmount = signal<number>(0);
  loading = signal<boolean>(true);

  constructor(
    private router: Router,
    private purchaseDetailsService: PurchaseDetailsService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (!state.purchaseId) {
      console.error('No purchase ID found');
      this.loading.set(false);
      return;
    }

    this.purchase.purchaseId = state.purchaseId;
    this.purchase.totalAmount = state.totalAmount ?? 0;
    this.totalAmount.set(this.purchase.totalAmount);

    this.purchaseDetailsService.GetProductsByPurchaseId(this.purchase.purchaseId)
      .subscribe({
        next: (data) => {
          console.log('Data received:', data);
          // חילוץ המוצרים מתוך PurchaseDetail
          const productsArray = data.map(item => item.product).filter(p => p != null);
          this.products.set(productsArray);
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