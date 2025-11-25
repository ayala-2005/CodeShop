import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root',
})
export class CodeShopService {
  constructor(private http:HttpClient)
  {
    
  }
  getAllProducts():Observable<Product[]>
  {
    return this.http.get<Product[]>("https://localhost:7272/api/Product")
  }
}
