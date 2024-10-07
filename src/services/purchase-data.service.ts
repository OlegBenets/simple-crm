import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Purchase } from '../models/purchase.class';
import { User } from '../models/user.class';
import { addDoc, collection, onSnapshot, query, updateDoc, where} from 'firebase/firestore';
import { UserService } from './user-data.service';
import { ProductDataService } from './product-data.service';
import { Product } from '../models/product.class';
import { ChartDataset } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private firestore: Firestore = inject(Firestore);
  allPurchases: Purchase[] = [];
  topSellingProduct: string = '';
  topBuyer: string = '';
  totalTarget: string = this.formatAsEuro(257000);
  totalValue: string = '0.00 €';
  totalDeals: number = 0;
  unsubSchribe: any;   
  
  constructor(public userService: UserService, public productService: ProductDataService) {
    this.unsubSchribe = this.subPurchaseList(); 
  }

  subPurchaseList() {
    return onSnapshot(this.getPurchaseRef(), (snapshot) => {
      this.allPurchases = [];
      snapshot.forEach((doc) => {
        let purchase = new Purchase({ ...doc.data(), id: doc.id });
        this.allPurchases.push(purchase);
      });
      this.updateDashboardMetrics();
      console.log(this.allPurchases);
    });
  }

  subCurrentYearPurchases(callback: (purchases: Purchase[]) => void) {
    let currentYear = new Date().getFullYear();

    onSnapshot(query(this.getPurchaseRef(), where('purchaseDate', '>=', new Date(currentYear, 0, 1))), (snapshot) => {
        let purchases: Purchase[] = [];
        snapshot.forEach((doc) => {
            let data = doc.data();
            let purchase = new Purchase({ 
                ...data, 
                id: doc.id,
                purchaseDate: data['purchaseDate'].toDate()
            });
            purchases.push(purchase);
        });
        
        callback(purchases);
    });
}

async aggregateMonthlyPurchases(purchases: Purchase[]): Promise<number[]> {
    let monthlyTotals = Array(12).fill(0); 

    purchases.forEach(purchase => {
        let purchaseMonth = purchase.purchaseDate.getMonth(); 
        monthlyTotals[purchaseMonth] += purchase.totalValue; 
    });

    return monthlyTotals;
}

getBarChartData(callback: (data: ChartDataset<'bar', number[]>[]) => void): void {
  this.subCurrentYearPurchases(async (purchases) => {
      let monthlyTotals = await this.aggregateMonthlyPurchases(purchases);

      let data: ChartDataset<'bar', number[]>[] = [{
          data: monthlyTotals,
          label: 'Total Purchases in €',
          backgroundColor: '#007f99',
      }];

      callback(data);
  });
}

async getDoughnutChartData(callback: (data: ChartDataset<'doughnut', number[]>[], labels: string[]) => void): Promise<void> {
  this.subCurrentYearPurchases((purchases) => {
      let productSales = this.calculateProductSales(purchases);
      let labels = Object.keys(productSales).map(productId => this.getNameById('product', productId));
      
      let data: ChartDataset<'doughnut', number[]>[] = [{
          data: Object.values(productSales),
          backgroundColor: ['#007f99', '#00839e', '#0094b2', '#00a5c6', '#00b6db', '#00c9f2', '#00d4ff'],
      }];
      
      callback(data, labels);
  });
}

private calculateProductSales(purchases: Purchase[]): { [productId: string]: number } {
  let productSales: { [productId: string]: number } = {};

  purchases.forEach(purchase => {
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

  async saveRandomPurchasesForUser(multiple = false) {
    if (this.productService.allProducts.length === 0 || this.userService.allUsers.length === 0) {
      console.error();
      return;
    }

    let randomUser = this.getRandomUser();
    let purchases = this.generatePurchases(randomUser, multiple);
    await this.savePurchases(purchases);
  }

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
        purchaseDate: new Date()
      });
      purchases.push(purchase);
    }
    return purchases;
  }

  private getRandomProduct(): Product {
    return this.productService.allProducts[Math.floor(Math.random() * this.productService.allProducts.length)];
  }

  private getRandomUser(): User {
    return this.userService.allUsers[Math.floor(Math.random() * this.userService.allUsers.length)];
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async getTotalValue(): Promise<number> {
    return this.allPurchases.reduce((sum, purchase) => sum + purchase.totalValue, 0);
}

  async savePurchases(purchases: Purchase[]) {
    for (let purchase of purchases) {
      try {
        let docRef = await addDoc(this.getPurchaseRef(), purchase.toJSON());
        let generatedId = docRef.id;

        purchase.id = generatedId;
        await updateDoc(docRef, { id: generatedId });

        console.log(docRef.id);
        this.allPurchases.push(purchase); 
      } catch (err) {
        console.error(err);
      }
    }
  }

  private formatAsEuro(value: number): string {
    return `${value.toFixed(2)} €`;
  }

  private async updateDashboardMetrics() {
    this.totalValue = this.formatAsEuro(await this.getTotalValue());
    this.topSellingProduct = await this.getTopItem('product');
    this.topBuyer = await this.getTopItem('user');
  }

  private async getTopItem(type: 'product' | 'user'): Promise<string> {
    let salesMap = this.collectSalesData(type);
    let topId = this.getTopId(salesMap);
    return this.getNameById(type, topId);
  }
  
  private collectSalesData(type: 'product' | 'user'): { [key: string]: number } {
    let salesMap: { [key: string]: number } = {};
    
    this.allPurchases.forEach(purchase => {
      let key = type === 'product' ? purchase.productId : purchase.userId;
      let value = type === 'product' ? purchase.quantity : purchase.totalValue;
  
      if (!salesMap[key]) {
        salesMap[key] = 0;
      }
      salesMap[key] += value;
    });
  
    return salesMap;
  }
  
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
  
  private getNameById(type: 'product' | 'user', id: string): string {
    if (type === 'product') {
      let topProduct = this.productService.allProducts.find(product => product.id === id);
      return topProduct ? topProduct.name : 'Unbekannt';
    } else {
      let bestBuyer = this.userService.allUsers.find(user => user.id === id);
      return bestBuyer ? bestBuyer.firstName : 'Unbekannt';
    }
  }

  ngOnDestroy() {
    if (this.unsubSchribe) {
      this.unsubSchribe();
    }
  }

  private getPurchaseRef() {
    return collection(this.firestore, 'purchases');
  }
}
