import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CodeShopService } from '../CodeShopService';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';

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

  constructor(private service: CodeShopService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.service.getAllProducts().subscribe({
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
      this.service.SelectByCompanyAndCategory(company, category).subscribe({
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
      this.service.SelectByCompany(company).subscribe({
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
      this.service.SelectByCategory(category).subscribe({
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
}