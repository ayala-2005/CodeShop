import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { Customer } from './models/customer';

@Injectable({
  providedIn: 'root',
})
export class CodeShopService {
  constructor(private http: HttpClient) { }
  ApiUrl = "https://localhost:7272/api"
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.ApiUrl + "/api/Product");
  }

  login(email: string, phone: string): Observable<Customer> {
    const body = { email, phone };
    return this.http.post<Customer>(
      this.ApiUrl + "/Customer/login",
      body
    );
  }

  register(email: string, name: string, phone: string, birthDate?: string): Observable<Customer> {
    const body = { email, customerName: name, phone, birthDate };
    return this.http.post<Customer>(
      this.ApiUrl + "/Customer/register",
      body
    );
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