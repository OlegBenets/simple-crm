import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-data.service';
import { BaseChartDirective } from 'ng2-charts';
import { ProductDataService } from '../../services/product-data.service';
import { PurchaseService } from '../../services/purchase-data.service';
import { Purchase } from '../../models/purchase.class';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
};
  barChartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  barChartLegend:boolean = true;
  barChartData: ChartDataset<'bar', number[]>[] = [];


  doughnutChartLabels:string[] = [];
  doughnutChartLegend:boolean = true;
  doughnutChartData: ChartDataset<'doughnut', number[]>[] = []; 

  allPurchases: Purchase[] = [];
  currentYear: number = new Date().getFullYear();
  currentQuarter: any;

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      title: {
          display: true,
          text: `Product Sales in ${this.currentYear}`,
          font: {
              size: 16
          }
      },
      legend: {
          display: false,
          position: 'top',
      }
  }
  };


  constructor(public purchaseService: PurchaseService,public userService: UserService, public productService: ProductDataService) {}

  async ngOnInit() {
    this.purchaseService.getBarChartData((data) => {
      this.barChartData = data;
  });
    
  this.purchaseService.getDoughnutChartData((data, labels) => {
    this.doughnutChartData = data;
    this.doughnutChartLabels = labels;
  });
  }

  async purchaseForRandomUser() {
    await this.purchaseService.saveRandomPurchasesForUser();
  }

  async triggerPurchase() {
    await this.purchaseForRandomUser();
  }

  chartClicked(e:any):void {

  }
 
  chartHovered(e:any):void {
    // if (e && e.active && e.active.length > 0) {
    //   const { dataIndex } = e.active[0];
    //   const month = this.barChartLabels[dataIndex];
    //   const totalPurchases = this.barChartData[0].data[dataIndex];

    //   console.log(`Hovered on ${month}: €${totalPurchases.toFixed(2)}`);
    // }
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

  //  getQuarter(currentQuarter: any) {
  //   currentQuarter = currentQuarter || new Date();
  //   let m = Math.floor(currentQuarter.getMonth() / 3) + 2;
  //   m -= m > 4 ? 4 : 0;
  //   let y = currentQuarter.getFullYear() + (m == 1? 1 : 0);
  //   return [y,m];
  // }
}
