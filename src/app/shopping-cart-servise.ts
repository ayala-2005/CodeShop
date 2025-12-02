import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from './models/purchase'
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartServise {
  constructor(private http: HttpClient) { }
  ApiUrl = "https://localhost:7272/api"
  GetClosedPurchases(customerId:number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.ApiUrl + "/Purchase/closed/"+customerId);
  }
ClosePurchase(customerId: number): Observable<Purchase> {
  return this.http.post<Purchase>(this.ApiUrl + "/Purchase/close/" + customerId, {});
}
}
