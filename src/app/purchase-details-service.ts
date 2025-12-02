import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDetail } from './models/purchase-detail';
import { Purchase } from './models/purchase';
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
RemoveProduct(customerId: number, productId: number): Observable<any> {
  return this.http.delete(
    this.ApiUrl + "/PurchaseDetails/remove/customer/" + customerId + "/product/" + productId
  );
}


AddListToCart(customerId: number, productIds: number[]) {
  return this.http.post(this.ApiUrl + "/PurchaseDetails/add-list/" + customerId, productIds);
}
GetOpenPurchase(customerId:number):Observable<Purchase>{
  return this.http.get<Purchase>(this.ApiUrl+"/PurchaseDetails/open/"+customerId)
}
}

