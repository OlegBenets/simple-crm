export class Product {
    id: string; 
    name: string;
    price: number;
    description: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.price = obj ? obj.price : '';
        this.description = obj ? obj.description : '';
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
        };
    }
}