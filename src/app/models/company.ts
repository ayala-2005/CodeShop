import { Product } from "./product"

export class Company {
    companyId:number
    companyName:string
    products:Product[]

    constructor(companyId:number,companyName:string,products:Product[])
    {
        this.companyId=companyId
        this.companyName=companyName
        this.products=products
    }
}
