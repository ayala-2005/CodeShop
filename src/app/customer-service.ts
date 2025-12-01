import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/customer';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  ApiUrl = "https://localhost:7272/api"
  constructor(private http: HttpClient) { }
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
}
