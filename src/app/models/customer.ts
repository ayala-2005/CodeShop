import { Purchase } from "./purchase";

export class Customer {
    customerId:number;
    customerName:string;
    phone:string;
    email:string;
    birthDate:Date;
    purchases:Purchase[]

    constructor(customerId:number,customerName:string,phone:string,email:string,birthDate:Date,purchases:Purchase[])
    {
        this.customerId=customerId;
        this.customerName=customerName;
        this.phone=phone;
        this.email=email;
        this.birthDate=birthDate;
        this.purchases=purchases;
    }
}
