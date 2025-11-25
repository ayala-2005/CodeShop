export class Product {
    productId: number;
    productName: string;

    categoryId: number | null;
    companyId: number | null;

    description: string | null;
    price: number;

    image: string | null;

    lastUpdateDate: Date | null;

    constructor(
        productId: number,
        productName: string,
        categoryId: number | null,
        companyId: number | null,
        description: string | null,
        price: number,
        image: string | null,
        lastUpdateDate: Date | null
    ) {
        this.productId = productId;
        this.productName = productName;
        this.categoryId = categoryId;
        this.companyId = companyId;
        this.description = description;
        this.price = price;
        this.image = image;
        this.lastUpdateDate = lastUpdateDate;
    }
}
