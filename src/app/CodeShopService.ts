import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { Customer } from './models/customer';

@Injectable({
  providedIn: 'root',
})
export class CodeShopService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>("https://localhost:7013/api/Product");
  }

  login(email: string, phone: string): Observable<Customer> {
    const body = { email, phone };
    return this.http.post<Customer>(
      "https://localhost:7013/api/Customer/login",
      body
    );
  }

  register(email: string, name: string, phone: string, birthDate?: string): Observable<Customer> {
    const body = { email, customerName: name, phone, birthDate };
    return this.http.post<Customer>(
      "https://localhost:7013/api/Customer/register",
      body
    );
  }
  SelectByCategory(category:string): Observable<Product[]> {
    return this.http.get<Product[]>("https://localhost:7272/api/Product/by-category?category=" + category);
  }
  SelectByCompany(company:string): Observable<Product[]> {
    return this.http.get<Product[]>("https://localhost:7272/api/Product/by-company?company=" + company);
  }
  SelectByCompanyAndCategory(company:string, category:string): Observable<Product[]> {
    return this.http.get<Product[]>("https://localhost:7272/api/Product/filter?company=" + company + "&category=" + category);
  }
}