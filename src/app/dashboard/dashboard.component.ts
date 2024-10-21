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
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  allPurchases: Purchase[] = [];
  currentYear: number = new Date().getFullYear();
  currentQuarter: any;

  barChartLabels: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  barChartLegend: boolean = false;
  barChartData: ChartDataset<'bar', number[]>[] = [];

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 8,
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Total Purcases in €',
        font: {
          size: 16,
        },
      },
      legend: {
        display: false,
        position: 'top',
      },
    },
  };

  doughnutChartLabels: string[] = [];
  doughnutChartLegend: boolean = true;
  doughnutChartData: ChartDataset<'doughnut', number[]>[] = [];

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Product Sales in ${this.currentYear}`,
        font: {
          size: 16,
        },
      },
      legend: {
        display: false,
        position: 'top',
      },
    },
  };

  /**
   * Constructs the DashboardComponent.
   * @param purchaseService - The service to handle purchase data.
   * @param userService - The service to handle user data.
   * @param productService - The service to handle product data.
   */
  constructor(
    public purchaseService: PurchaseService,
    public userService: UserService,
    public productService: ProductDataService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a component are initialized.
   * This method subscribes to window resize events and fetches the chart data for the dashboard.
   */
  async ngOnInit() {
    window.addEventListener('resize', () => {
      this.updateLegendVisibility();
    });

    this.purchaseService.getBarChartData((data) => {
      this.barChartData = data;
    });

    this.purchaseService.getDoughnutChartData((data, labels) => {
      this.doughnutChartData = data;
      this.doughnutChartLabels = labels;
    });

    this.updateLegendVisibility();
  }

  /**
   * Fetches and saves random purchases for a user.
   * This method calls the purchase service to perform the operation.
   */
  async purchaseForRandomUser() {
    await this.purchaseService.saveRandomPurchasesForUser();
  }

  /**
   * Triggers the purchase for a random user by calling purchaseForRandomUser().
   */
  async triggerPurchase() {
    await this.purchaseForRandomUser();
  }

  /**
   * Updates the visibility of the doughnut chart legend based on the window width.
   * If the width is less than 600 pixels, the legend will be hidden; otherwise, it will be shown.
   */
  updateLegendVisibility() {
    let screenWidth = window.innerWidth;

    if (screenWidth < 600) {
      this.doughnutChartLegend = false;
    } else {
      this.doughnutChartLegend = true;
    }
  }
}
