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
 }
