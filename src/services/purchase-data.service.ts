import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Purchase } from '../models/purchase.class';
import { User } from '../models/user.class';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { UserService } from './user-data.service';
import { ProductDataService } from './product-data.service';
import { Product } from '../models/product.class';
import { ChartDataset } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  allPurchases: Purchase[] = [];
  topSellingProduct: string = '';
  topBuyer: string = '';
  totalTarget: string = this.formatAsEuro(257000);
  totalValue: string = '0.00 €';
  totalDeals: number = 0;
  unsubSchribe: any;
  backgroundColor: string[] = [
    '#007f99',
    '#00839e',
    '#0094b2',
    '#00a5c6',
    '#00b6db',
    '#00c9f2',
    '#00d4ff',
    '26deff',
    '41e0fc',
    '60e7ff',
    '7febff',
  ];

  /**
   * Constructor to initialize the PurchaseService.
   *
   * @param firestore The Firestore instance for database operations.
   * @param userService The service for managing user data.
   * @param productService The service for managing product data.
   */
  constructor(
    private firestore: Firestore,
    public userService: UserService,
    public productService: ProductDataService
  ) {
    this.unsubSchribe = this.subPurchaseList();
  }

  /**
   * Subscribes to the purchase list in Firestore and updates the local purchases array.
   *
   * @returns Unsubscribe function for the snapshot listener.
   */
  subPurchaseList() {
    return onSnapshot(this.getPurchaseRef(), (snapshot) => {
      this.allPurchases = [];
      snapshot.forEach((doc) => {
        let purchase = new Purchase({ ...doc.data(), id: doc.id });
        this.allPurchases.push(purchase);
      });
      this.updateDashboardMetrics();
    });
  }

  /**
   * Subscribes to purchases made in the current year and calls the provided callback with the purchases.
   *
   * @param callback The callback function to handle the current year purchases.
   */
  subCurrentYearPurchases(callback: (purchases: Purchase[]) => void) {
    let currentYear = new Date().getFullYear();

    onSnapshot(
      query(
        this.getPurchaseRef(),
        where('purchaseDate', '>=', new Date(currentYear, 0, 1))
      ),
      (snapshot) => {
        let purchases: Purchase[] = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          let purchase = new Purchase({
            ...data,
            id: doc.id,
            purchaseDate: data['purchaseDate'].toDate(),
          });
          purchases.push(purchase);
        });

        callback(purchases);
      }
    );
  }

  /**
   * Aggregates the monthly purchase totals from the given purchases.
   *
   * @param purchases The array of purchases to aggregate.
   * @returns A promise that resolves to an array of monthly totals.
   */
  async aggregateMonthlyPurchases(purchases: Purchase[]): Promise<number[]> {
    let monthlyTotals = Array(12).fill(0);

    purchases.forEach((purchase) => {
      let purchaseMonth = purchase.purchaseDate.getMonth();
      monthlyTotals[purchaseMonth] += purchase.totalValue;
    });

    return monthlyTotals;
  }

  /**
   * Retrieves data for a bar chart based on the current year's purchases.
   *
   * @param callback The callback function to handle the chart data.
   */
  getBarChartData(
    callback: (data: ChartDataset<'bar', number[]>[]) => void
  ): void {
    this.subCurrentYearPurchases(async (purchases) => {
      let monthlyTotals = await this.aggregateMonthlyPurchases(purchases);

      let data: ChartDataset<'bar', number[]>[] = [
        {
          data: monthlyTotals,
          backgroundColor: '#007f99',
        },
      ];

      callback(data);
    });
  }

  /**
   * Retrieves data for a doughnut chart based on product sales from the current year's purchases.
   *
   * @param callback The callback function to handle the chart data and labels.
   */
  async getDoughnutChartData(
    callback: (
      data: ChartDataset<'doughnut', number[]>[],
      labels: string[]
    ) => void
  ): Promise<void> {
    this.subCurrentYearPurchases((purchases) => {
      let productSales = this.calculateProductSales(purchases);
      let labels = Object.keys(productSales).map((productId) =>
        this.getNameById('product', productId)
      );

      let data: ChartDataset<'doughnut', number[]>[] = [
        {
          data: Object.values(productSales),
          backgroundColor: this.backgroundColor,
        },
      ];

      callback(data, labels);
    });
  }

  /**
   * Calculates total sales for each product based on the given purchases.
   *
   * @param purchases The array of purchases to analyze.
   * @returns An object mapping product IDs to their total sales quantities.
   */
  private calculateProductSales(purchases: Purchase[]): {
    [productId: string]: number;
  } {
    let productSales: { [productId: string]: number } = {};

    purchases.forEach((purchase) => {
      let productId = purchase.productId;
      let quantity = purchase.quantity;

      if (productSales[productId]) {
        productSales[productId] += quantity;
      } else {
        productSales[productId] = quantity;
      }
    });

    return productSales;
  }

  /**
   * Generates and saves random purchases for a random user.
   *
   * @param multiple Whether to generate multiple purchases for the user.
   */
  async saveRandomPurchasesForUser(multiple = false) {
    if (
      this.productService.allProducts.length === 0 ||
      this.userService.allUsers.length === 0
    ) {
      console.error();
      return;
    }

    let randomUser = this.getRandomUser();
    let purchases = this.generatePurchases(randomUser, multiple);
    await this.savePurchases(purchases);
  }

  /**
   * Generates an array of purchase instances for a specific user.
   *
   * @param user The user for whom purchases will be generated.
   * @param multiple Whether to generate multiple purchases.
   * @returns An array of Purchase instances.
   */
  private generatePurchases(user: User, multiple: boolean): Purchase[] {
    let purchases: Purchase[] = [];
    let numPurchases = multiple ? this.getRandomInt(1, 5) : 1;

    for (let i = 0; i < numPurchases; i++) {
      let randomProduct = this.getRandomProduct();
      let purchase = new Purchase({
        userId: user.id,
        productId: randomProduct.id,
        price: randomProduct.price,
        quantity: this.getRandomInt(1, 10),
        purchaseDate: new Date(),
      });
      purchases.push(purchase);
    }
    return purchases;
  }

  /**
   * Selects a random product from the product service's product list.
   *
   * @returns A randomly selected Product instance.
   */
  private getRandomProduct(): Product {
    return this.productService.allProducts[
      Math.floor(Math.random() * this.productService.allProducts.length)
    ];
  }

  /**
   * Selects a random user from the user service's user list.
   *
   * @returns A randomly selected User instance.
   */
  private getRandomUser(): User {
    return this.userService.allUsers[
      Math.floor(Math.random() * this.userService.allUsers.length)
    ];
  }

  /**
   * Generates a random integer between min and max (inclusive).
   *
   * @param min The minimum value.
   * @param max The maximum value.
   * @returns A random integer.
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculates the total value of all purchases.
   *
   * @returns A promise that resolves to the total value of purchases.
   */
  async getTotalValue(): Promise<number> {
    return this.allPurchases.reduce(
      (sum, purchase) => sum + purchase.totalValue,
      0
    );
  }

  /**
   * Saves an array of purchases to Firestore.
   *
   * @param purchases The array of Purchase instances to save.
   */
  async savePurchases(purchases: Purchase[]) {
    for (let purchase of purchases) {
      try {
        let docRef = await addDoc(this.getPurchaseRef(), purchase.toJSON());
        let generatedId = docRef.id;

        purchase.id = generatedId;
        await updateDoc(docRef, { id: generatedId });

        this.allPurchases.push(purchase);
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * Formats a number as a Euro currency string.
   *
   * @param value The number to format.
   * @returns A string representing the value formatted in Euro.
   */
  private formatAsEuro(value: number): string {
    return `${value.toFixed(2)} €`;
  }

  /**
   * Updates dashboard metrics based on current purchases.
   */
  private async updateDashboardMetrics() {
    this.totalValue = this.formatAsEuro(await this.getTotalValue());
    this.topSellingProduct = await this.getTopItem('product');
    this.topBuyer = await this.getTopItem('user');
  }

  /**
   * Retrieves the top item (product or user) based on sales data.
   *
   * @param type The type of item to get ('product' or 'user').
   * @returns A promise that resolves to the name of the top item.
   */
  private async getTopItem(type: 'product' | 'user'): Promise<string> {
    let salesMap = this.collectSalesData(type);
    let topId = this.getTopId(salesMap);
    return this.getNameById(type, topId);
  }

  /**
   * Collects sales data based on purchases for a given type (product or user).
   *
   * @param type The type of sales data to collect ('product' or 'user').
   * @returns An object mapping IDs to their total sales values.
   */
  private collectSalesData(type: 'product' | 'user'): {
    [key: string]: number;
  } {
    let salesMap: { [key: string]: number } = {};

    this.allPurchases.forEach((purchase) => {
      let key = type === 'product' ? purchase.productId : purchase.userId;
      let value = type === 'product' ? purchase.quantity : purchase.totalValue;

      if (!salesMap[key]) {
        salesMap[key] = 0;
      }
      salesMap[key] += value;
    });

    return salesMap;
  }

  /**
   * Retrieves the ID of the top item based on total sales value.
   *
   * @param salesMap An object mapping IDs to their total sales values.
   * @returns The ID of the top item.
   */
  private getTopId(salesMap: { [key: string]: number }): string {
    let topId = '';
    let highestValue = 0;

    for (let [id, total] of Object.entries(salesMap)) {
      if (total > highestValue) {
        topId = id;
        highestValue = total;
      }
    }

    return topId;
  }

  /**
   * Retrieves the name of a product or user based on their ID.
   *
   * @param type The type of entity ('product' or 'user').
   * @param id The ID of the entity.
   * @returns The name of the entity or 'Unbekannt' if not found.
   */
  private getNameById(type: 'product' | 'user', id: string): string {
    if (type === 'product') {
      let topProduct = this.productService.allProducts.find(
        (product) => product.id === id
      );
      return topProduct ? topProduct.name : 'Unbekannt';
    } else {
      let bestBuyer = this.userService.allUsers.find((user) => user.id === id);
      return bestBuyer ? bestBuyer.firstName : 'Unbekannt';
    }
  }

  /**
   * Cleanup function to unsubscribe from Firestore listeners when the service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubSchribe) {
      this.unsubSchribe();
    }
  }

  /**
   * Retrieves a reference to the Firestore collection for purchases.
   *
   * @returns A reference to the Firestore 'purchases' collection.
   */
  private getPurchaseRef() {
    return collection(this.firestore, 'purchases');
  }
}
