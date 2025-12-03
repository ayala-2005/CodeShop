import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../product-Service';
import { PurchaseDetailsService } from '../purchase-details-service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PurchaseDetail } from '../models/purchase-detail';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  imports:[CommonModule],
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {
  selectedCompany: string | null = null;
  selectedCategory: string | null = null;

  list: Product[] = [];
  loading: boolean = true;
  customerId = JSON.parse(localStorage.getItem('currentUser') || '{}').customerId;

  toastVisible: boolean = false;
  toastMessage: string = "";

  constructor(
    private ProductService: ProductService,
    private PurchaseDetailsService: PurchaseDetailsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.markForCheck();
    }, 2500);
  }

  loadProducts(): void {
    this.loading = true;
    this.ProductService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.list = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  select(): void {
    const companyInput = document.querySelector<HTMLInputElement>('input[name="company"]:checked');
    const categoryInput = document.querySelector<HTMLInputElement>('input[name="lang"]:checked');

    const company = companyInput ? companyInput.value : null;
    const category = categoryInput ? categoryInput.value : null;

    this.loading = true;

    if (company && category) {
      this.ProductService.SelectByCompanyAndCategory(company, category).subscribe({
        next: (data: Product[]) => {
          this.list = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else if (company) {
      this.ProductService.SelectByCompany(company).subscribe({
        next: (data: Product[]) => {
          this.list = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else if (category) {
      this.ProductService.SelectByCategory(category).subscribe({
        next: (data: Product[]) => {
          this.list = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.list = [];
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  resetFilters(): void {
    const checkedInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked');
    checkedInputs.forEach(input => input.checked = false);

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
          next: (res) => {
            console.log("נוסף בהצלחה בשרת", res);
            this.showToast("המוצר נוסף לעגלה ✔");
          },
          error: (err) => {
            console.error("שגיאה בהוספת מוצר לשרת", err);
            this.showToast("המוצר כבר קיים בעגלה");
          }
        });
    } else {
      const localCartRaw = localStorage.getItem('cart');
      let localCart: PurchaseDetail[] = localCartRaw ? JSON.parse(localCartRaw) : [];

      const exists = localCart.some(item => item.productId === product.productId);
      if (!exists) {
        localCart.push({
          purchaseId: 0,
          productId: product.productId,
          product: product
        });
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.log("המוצר נוסף לסל מקומי", product.productId);
        this.showToast("המוצר נוסף לעגלה ✔");
      } else {
        console.log("המוצר כבר קיים בעגלה המקומית", product.productId);
        this.showToast("המוצר כבר קיים בעגלה");
      }
    }
  }
}
