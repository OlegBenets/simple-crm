/**
 * Represents a product in the application.
 */
export class Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  detail: string[];

  /**
   * Creates an instance of the Product class.
   *
   * @param obj Optional object to initialize the product properties.
   */
  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.price = obj ? obj.price : '';
    this.description = obj ? obj.description : '';
    this.detail = Array.isArray(obj?.detail) ? obj.detail : [];
  }

  /**
   * Converts the product instance to a JSON-compatible object.
   *
   * @returns An object representation of the product instance, suitable for serialization.
   */
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
