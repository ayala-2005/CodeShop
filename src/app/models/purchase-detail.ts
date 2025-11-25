export class PurchaseDetail {
    PurchaseDetailId:number
    PurchaseId:number
    ProductId:number
    Quantity:number

    constructor(PurchaseDetailId:number,PurchaseId:number,ProductId:number,Quantity:number)
    {
        this.PurchaseDetailId=PurchaseDetailId
        this.PurchaseId=PurchaseId
        this.ProductId=ProductId
        this.Quantity=Quantity
    }
}
