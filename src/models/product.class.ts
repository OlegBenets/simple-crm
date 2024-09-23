export class Product {
    id: string; 
    name: string;
    price: number | string;
    description: string;
    detail: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.price = obj ? obj.price : '';
        this.description = obj ? obj.description : '';
        this.detail = obj ? obj.detail : '';
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            detail: this.detail,
        };
    }
}