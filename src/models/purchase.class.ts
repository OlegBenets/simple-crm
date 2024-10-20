/**
 * Represents a purchase transaction in the application.
 */
export class Purchase {
  id?: string;
  userId: string;
  productId: string;
  price: number;
  quantity: number;
  totalValue: number;
  purchaseDate: Date;

  /**
   * Creates an instance of the Purchase class.
   *
   * @param obj Optional object to initialize the purchase properties.
   */
  constructor(obj?: any) {
    this.id = obj.id || '';
    this.userId = obj ? obj.userId : '';
    this.productId = obj ? obj.productId : '';

    let priceAsNumber =
      typeof obj?.price === 'string'
        ? parseFloat(obj.price.replace('€', '').trim())
        : obj?.price || 0;

    this.price = priceAsNumber;
    this.quantity = obj ? obj.quantity : 0;
    this.totalValue = this.price * this.quantity;
    this.purchaseDate = obj
      ? obj.purchaseDate instanceof Date
        ? obj.purchaseDate
        : new Date(obj.purchaseDate)
      : new Date();
  }

  /**
   * Converts the purchase instance to a JSON-compatible object.
   *
   * @returns An object representation of the purchase instance, suitable for serialization.
   */
  public toJSON() {
    return {
      userId: this.userId,
      productId: this.productId,
      price: this.price,
      quantity: this.quantity,
      totalValue: this.totalValue,
      purchaseDate: this.purchaseDate,
    };
  }
}
