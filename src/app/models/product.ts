export class Product {
    productId: number;
    productName: string;

    categoryName: string | null;
    companyName: string | null;

    description: string | null;
    price: number;

    image: string | null;

    lastUpdateDate: Date | null;

    constructor(
        productId: number,
        productName: string,
        categoryName: string | null,
        companyName: string | null,
        description: string | null,
        price: number,
        image: string | null,
        lastUpdateDate: Date | null
    ) {
        this.productId = productId;
        this.productName = productName;
        this.categoryName = categoryName;
        this.companyName = companyName;
        this.description = description;
        this.price = price;
        this.image = image;
        this.lastUpdateDate = lastUpdateDate;
    }
}
