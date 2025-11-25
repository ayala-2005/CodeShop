import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';

// ✅ מודלים להתחברות/הרשמה
export interface LoginRequest {
  email: string;
  phone: string;
}

export interface RegisterRequest {
  email: string;
  customerName: string;
  phone: string;
  birthDate?: string; // אופציונלי
}

export interface CustomerDTO {
  customerId?: number;
  email: string;
  customerName: string;
  phone: string;
  birthDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CodeShopService {
  private apiUrl = "https://localhost:7013/api";

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Product`);
  }

  // ✅ התחברות - עם Email ו-Phone
  login(email: string, phone: string): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(`${this.apiUrl}/Customer/login`, {
      email,
      phone
    });
  }

  // ✅ הרשמה
  register(customerData: RegisterRequest): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(`${this.apiUrl}/Customer/register`, customerData);
  }
}