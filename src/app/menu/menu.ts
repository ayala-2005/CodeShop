// import { Component, OnInit } from '@angular/core';
// import { CodeShopService } from '../CodeShopService';
// import { Product } from '../models/product';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   templateUrl: './menu.html',
//   styleUrls: ['./menu.css'],
//   imports: [CommonModule]
// })
// export class Menu implements OnInit {

//   list: Product[] = [];
//   loading: boolean = true;

//   constructor(private service: CodeShopService) {}

//   ngOnInit(): void {
//     this.service.getAllProducts().subscribe({
//       next: (data: Product[]) => {
//         this.list = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }
// }
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

  list = signal<Product[]>([]);
  loading = signal<boolean>(true);

  constructor(private service: CodeShopService,private cdr: ChangeDetectorRef) 
  {

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
}