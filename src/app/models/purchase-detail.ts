import { Product } from "../models/product";


export class PurchaseDetail {
  purchaseId: number;
  productId: number;
  product?: Product; 

  constructor(purchaseId: number, productId: number, product?: Product) {
    this.purchaseId = purchaseId;
    this.productId = productId;
    this.product = product;
  }
}
