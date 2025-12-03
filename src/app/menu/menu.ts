import { Component, OnInit, signal, effect } from '@angular/core';
import { ProductService } from '../product-Service';
import { PurchaseDetailsService } from '../purchase-details-service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PurchaseDetail } from '../models/purchase-detail';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  imports: [CommonModule],
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {

  selectedCompany: string | null = null;
  selectedCategory: string | null = null;

  list = signal<Product[]>([]);
  loading = signal(true);

  // toast using signals
  toastVisible = signal(false);
  toastMessage = signal("");

  // current user
  customerId = JSON.parse(localStorage.getItem('currentUser') || '{}').customerId;

  constructor(
    private ProductService: ProductService,
    private PurchaseDetailsService: PurchaseDetailsService,
    private router: Router
  ) {
    // Hide toast automatically when it becomes visible
    effect(() => {
      if (this.toastVisible()) {
        setTimeout(() => {
          this.toastVisible.set(false);
        }, 2500);
      }
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  showToast(message: string) {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
  }

  loadProducts(): void {
    this.loading.set(true);
    this.ProductService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.list.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  select(): void {
    const companyInput = document.querySelector<HTMLInputElement>('input[name="company"]:checked');
    const categoryInput = document.querySelector<HTMLInputElement>('input[name="lang"]:checked');

    const company = companyInput ? companyInput.value : null;
    const category = categoryInput ? categoryInput.value : null;

    this.loading.set(true);

    if (company && category) {
      this.ProductService.SelectByCompanyAndCategory(company, category).subscribe({
        next: (data: Product[]) => {
          this.list.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });

    } else if (company) {
      this.ProductService.SelectByCompany(company).subscribe({
        next: (data: Product[]) => {
          this.list.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });

    } else if (category) {
      this.ProductService.SelectByCategory(category).subscribe({
        next: (data: Product[]) => {
          this.list.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });

    } else {
      this.list.set([]);
      this.loading.set(false);
    }
  }

  resetFilters(): void {
    const checkedInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked');
    checkedInputs.forEach(i => i.checked = false);

    this.selectedCompany = null;
    this.selectedCategory = null;

    this.loadProducts();
  }

  details(product: Product) {
    this.router.navigate(['/product-details'], { state: { product } });
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
