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
  // הוסף אחרי selectedCategory:
minPrice = signal(0);
maxPrice = signal(500);

priceFilterMin = signal(0);
priceFilterMax = signal(500);

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
  
    let observable;
  
    if (company && category) {
      observable = this.ProductService.SelectByCompanyAndCategory(company, category);
    } else if (company) {
      observable = this.ProductService.SelectByCompany(company);
    } else if (category) {
      observable = this.ProductService.SelectByCategory(category);
    } else {
      observable = this.ProductService.getAllProducts();
    }
  
    observable.subscribe({
      next: (data: Product[]) => {
        // סינון לפי מחיר
        const filtered = data.filter(p => 
          p.price >= this.priceFilterMin() && p.price <= this.priceFilterMax()
        );
        this.list.set(filtered);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  resetFilters(): void {
    const checkedInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked');
    checkedInputs.forEach(i => i.checked = false);
  
    this.selectedCompany = null;
    this.selectedCategory = null;
    
    // איפוס מחיר
    this.priceFilterMin.set(0);
    this.priceFilterMax.set(500);
    const minSlider = document.querySelector<HTMLInputElement>('#priceMin');
    const maxSlider = document.querySelector<HTMLInputElement>('#priceMax');
    if (minSlider) minSlider.value = '0';
    if (maxSlider) maxSlider.value = '500';
  
    this.loadProducts();
  }
updatePriceFilter(min: number, max: number): void {
  this.priceFilterMin.set(min);
  this.priceFilterMax.set(max);
  this.select();
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
