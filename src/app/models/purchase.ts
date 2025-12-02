import { PurchaseDetail } from "./purchase-detail"

export class Purchase {
    purchaseId:number
    customerId:number
    purchaseDate:Date
    totalAmount:number
    note:string

    constructor(PurchaseId:number,CustomerId:number,PurchaseDate:Date,TotalAmount:number,Note:string)
    {
        this.purchaseId=PurchaseId
        this.customerId=CustomerId
        this.purchaseDate=PurchaseDate
        this.totalAmount=TotalAmount
        this.note=Note
    }
}
