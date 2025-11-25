import { PurchaseDetail } from "./purchase-detail"

export class Purchase {
    PurchaseId:number
    CustomerId:number
    PurchaseDate:Date
    TotalAmount:number
    Note:string
    PurchaseDetails:PurchaseDetail[]

    constructor(PurchaseId:number,CustomerId:number,PurchaseDate:Date,TotalAmount:number,Note:string,PurchaseDetails:PurchaseDetail[])
    {
        this.PurchaseId=PurchaseId
        this.CustomerId=CustomerId
        this.PurchaseDate=PurchaseDate
        this.TotalAmount=TotalAmount
        this.Note=Note
        this.PurchaseDetails=PurchaseDetails
    }
}
