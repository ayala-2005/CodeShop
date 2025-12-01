import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ProductService } from '../product-Service';
import {PurchaseDetailsService} from '../purchase-details-service'
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  imports: [CommonModule]
})
export class Menu implements OnInit {
  selectedCompany: string | null = null;
  selectedCategory: string | null = null;

  list = signal<Product[]>([]);
  loading = signal<boolean>(true);
  customerId = JSON.parse(localStorage.getItem('currentUser') || '{}').customerId;

  constructor(private ProductService: ProductService,private PurchaseDetailsService:PurchaseDetailsService, private cdr: ChangeDetectorRef, private router: Router) {

  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.ProductService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.list.set(data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }
  select(): void {
    // קבלת הערכים שנבחרו
    const companyInput = document.querySelector<HTMLInputElement>('input[name="company"]:checked');
    const categoryInput = document.querySelector<HTMLInputElement>('input[name="lang"]:checked');

    const company = companyInput ? companyInput.value : null;
    const category = categoryInput ? categoryInput.value : null;

    this.loading.set(true);

    if (company && category) {
      // אם יש גם חברה וגם קטגוריה → סינון לפי שניהם
      this.ProductService.SelectByCompanyAndCategory(company, category).subscribe({
        next: (data: Product[]) => {
          this.list.set(data);
          this.loading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading.set(false);
          this.cdr.markForCheck();
        }
      });
    } else if (company) {
      // אם רק חברה נבחרה
      this.ProductService.SelectByCompany(company).subscribe({
        next: (data: Product[]) => {
          this.list.set(data);
          this.loading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading.set(false);
          this.cdr.markForCheck();
        }
      });
    } else if (category) {
      // אם רק קטגוריה נבחרה
      this.ProductService.SelectByCategory(category).subscribe({
        next: (data: Product[]) => {
          this.list.set(data);
          this.loading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading.set(false);
          this.cdr.markForCheck();
        }
      });
    } else {
      // אם לא נבחר כלום → אפשר להחזיר את כל המוצרים או ריק
      this.list.set([]);
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }
  resetFilters(): void {
    // איפוס הכפתורים (רדיו)
    const checkedInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked');
    checkedInputs.forEach(input => input.checked = false);

    // איפוס המשתנים
    this.selectedCompany = null;
    this.selectedCategory = null;

    // טעינת כל המוצרים
    this.loadProducts();
  }
  details(product: any) {
    this.router.navigate(['/product-details'], { state: { product } });
  }
  addProduct(customerId: number, productId: number) {
  this.PurchaseDetailsService
    .AddProductToPurchase(customerId, productId)
    .subscribe({
      next: (res) => {
        console.log("נוסף בהצלחה", res);
      },
      error: (err) => {
        console.error("שגיאה בהוספת מוצר", err);
      }
    });
}
}