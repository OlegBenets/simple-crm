import { Component } from '@angular/core';
import { UserService } from '../../services/user-data.service';
import { BaseChartDirective } from 'ng2-charts';
import { ProductDataService } from '../../services/product-data.service';
import { data } from 'cypress/types/jquery';
import { PurchaseService } from '../../services/purchase-data.service';

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

  constructor(public purchaseService: PurchaseService,public userService: UserService, public productService: ProductDataService) {}

  async ngOnInit(): Promise<void> {
    await this.loadData(); 
    this.generatePurchases();
  }

  async loadData(): Promise<void> {
    try {
      await Promise.all([
        this.userService.subUserList(), 
        this.productService.subProductList()
      ]);

      if (this.userService.allUsers.length === 0) {
        console.error('Keine Benutzer gefunden!');
      }

      if (this.productService.allProducts.length === 0) {
        console.error('Keine Produkte gefunden!');
      }

    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  }

  async generatePurchases() {
    if (this.userService.allUsers.length > 0 && this.productService.allProducts.length > 0) {
      const user = this.userService.allUsers[0]; // Beispiel: Nimm den ersten Benutzer
      const products = this.productService.allProducts; // Alle Produkte
      await this.purchaseService.generateAndSavePurchases(user, products);
    } else {
      console.error('Keine Benutzer oder Produkte gefunden!');
    }
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
