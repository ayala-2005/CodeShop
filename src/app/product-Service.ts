import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) { }
  ApiUrl = "https://localhost:7272/api"
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.ApiUrl + "/Product");
  }


  SelectByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.ApiUrl + "/Product/by-category?category=" + category);
  }
  SelectByCompany(company: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.ApiUrl + "/Product/by-company?company=" + company);
  }
  SelectByCompanyAndCategory(company: string, category: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.ApiUrl + "/Product/filter?company=" + company + "&category=" + category);
  }
}