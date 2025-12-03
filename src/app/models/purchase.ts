export interface Purchase {
  purchaseId: number;
  customerId: number;
  purchaseDate: string;  
  totalAmount: number;
  note: string | null;
  isOpen: boolean;

  // constructor(
  //   purchaseId: number,
  //   customerId: number,
  //   purchaseDate: string,
  //   totalAmount: number,
  //   note: string | null,
  //   isOpen: boolean
  // ) {
  //   this.purchaseId = purchaseId;
  //   this.customerId = customerId;
  //   this.purchaseDate = purchaseDate;
  //   this.totalAmount = totalAmount;
  //   this.note = note;
  //   this.isOpen = isOpen;
  // }
}