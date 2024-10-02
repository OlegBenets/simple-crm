import { Component } from '@angular/core';
import { UserService } from '../../services/user-data.service';
import { BaseChartDirective } from 'ng2-charts';
import { ProductDataService } from '../../services/product-data.service';
import { data } from 'cypress/types/jquery';
import { PurchaseService } from '../../services/purchase-data.service';
import { Product } from '../../models/product.class';
import { User } from '../../models/user.class';
import { Purchase } from '../../models/purchase.class';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  

  barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  barChartLegend:boolean = true;
 
  barChartData:any[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40], 
      label: 'Series A',
      backgroundColor: '#007f99', 
    },
    {
      data: [28, 48, 40, 19, 86, 27, 90], 
      label: 'Series B',
      backgroundColor: '#00d4ff', 
    }
  ];


  doughnutChartData = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Sales Percent',
        backgroundColor: [
          '#007f99',
          '#00839e',
          '#0094b2', 
          '#00a5c6', 
          '#00b6db',
          '#00c5ed',
          '#00d4ff'
        ],
        cutout: '60%',
      }
    ]
  }

  doughnutChartOptions = {
    responsive: true
  }

  topSellingProduct: string = '';
  topBuyer: string = '';
  totalTarget: number = 150700;
  totalValue: number = 0;
  totalDeals: number = 0;
  allPurchases: Purchase[] = [];

  constructor(public purchaseService: PurchaseService,public userService: UserService, public productService: ProductDataService) {}

  async ngOnInit(): Promise<void> {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.topSellingProduct = await this.getTopSellingProduct();
    this.topBuyer = await this.getTopBuyer();
    this.totalValue =  this.getTotalValue();
  }

  async getTopSellingProduct(): Promise<string> {
 let productSalesMap: { [productId: string]: number } = {};

    this.allPurchases.forEach(purchase => {
      if (!productSalesMap[purchase.productId]) {
        productSalesMap[purchase.productId] = 0;
      }
      productSalesMap[purchase.productId] += purchase.quantity;
    });

    let topProductId = '';
    let highestQuantity = 0;

    for (const [productId, quantity] of Object.entries(productSalesMap)) {
      if (quantity > highestQuantity) {
        topProductId = productId;
        highestQuantity = quantity;
      }
    }

    let topProduct = this.productService.allProducts.find(product => product.id === topProductId);
    return topProduct ? topProduct.name : 'Unbekannt';
  }

  async getTopBuyer(): Promise<string> {
    let userSpendingMap: { [userId: string]: number } = {};
    
    this.allPurchases.forEach(purchase => {
      if (!userSpendingMap[purchase.userId]) {
        userSpendingMap[purchase.userId] = 0;
      }
      userSpendingMap[purchase.userId] += purchase.totalValue;
    });

    let bestBuyerId = '';
    let highestValue = 0;
    
    for (const [userId, totalValue] of Object.entries(userSpendingMap)) {
      if (totalValue > highestValue) {
        bestBuyerId = userId;
        highestValue = totalValue;
      }
    }

    let bestBuyer = this.userService.allUsers.find(user => user.id === bestBuyerId);
    return bestBuyer ? bestBuyer.firstName : 'Unbekannt';
  }

  getTotalValue(): number {
    return this.allPurchases.reduce((sum, purchase) => sum + purchase.totalValue, 0);
  }

  async purchaseForUser() {
    if (this.userService.allUsers.length === 0) {
      console.error('Keine Benutzer verfügbar');
      return;
    }
    let user = this.userService.allUsers[0];
    await this.purchaseService.generateAndSavePurchaseForUser(user);
  }

  async triggerPurchase() {
    await this.purchaseForUser();
  }


  chartClicked(e:any):void {

  }
 
  chartHovered(e:any):void {

  }
 
  randomize():void {
    // let data = [
    //   Math.round(Math.random() * 100),
    //   59,
    //   80,
    //   (Math.random() * 100),
    //   56,
    //   (Math.random() * 100),
    //   40];
    // let clone = JSON.parse(JSON.stringify(this.barChartData));
    // clone[0].data = data;
    // this.barChartData = clone;
  }

  //  getQuarter(d) {
//     d = d || new Date();
//     let m = Math.floor(d.getMonth() / 3) + 2;
//     m -= m > 4 ? 4 : 0;
//     let y = d.getFullYear() + (m == 1? 1 : 0);
//     return [y,m];
//   }
  
//   console.log(`The current US fiscal quarter is ${getQuarter().join('Q')}`);
//   console.log(`1 July 2018 is ${getQuarter(new Date(2018,6,1)).join('Q')}`);

}
