import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDetail } from './models/purchase-detail';
@Injectable({
  providedIn: 'root',
})
export class PurchaseDetailsService {
  constructor(private http: HttpClient) {}
ApiUrl="https://localhost:7272/api"

AddProductToPurchase(customerId: number, productId: number): Observable<PurchaseDetail> {
  const body = { customerId, productId }; 
  return this.http.post<PurchaseDetail>(
    this.ApiUrl + "/PurchaseDetails/customer/" + customerId + "/product/" + productId,
    body
  );
}
GetCartProducts(customerId: number): Observable<PurchaseDetail[]> {
  return this.http.get<PurchaseDetail[]>(this.ApiUrl + "/PurchaseDetails/GetCartProducts?customerId=" + customerId);
}
RemoveProduct(purchaseId: number, productId: number): Observable<PurchaseDetail> {
  return this.http.delete<PurchaseDetail>(
    this.ApiUrl + "/PurchaseDetails/remove/purchase/" + purchaseId + "/product/" + productId
  );
}
}

