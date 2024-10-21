import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../models/product.class';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TooltipComponent,
    MatTooltipModule,
    MatCardModule,
    CommonModule,
    RouterModule,
    MatFormField,
    MatInputModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product = new Product();

  /**
   * Constructs the ProductComponent.
   *
   * @param dialog - MatDialog service for opening dialogs
   * @param productService - Service to manage product data and operations
   */
  constructor(
    public dialog: MatDialog,
    public productService: ProductDataService
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Initializes the filtered products with all available products.
   */
  ngOnInit() {
    this.productService.filteredProducts = this.productService.allProducts;
  }

  /**
   * Opens a dialog for adding a new product.
   */
  openDialog() {
    this.dialog.open(DialogAddProductComponent);
  }

  /**
   * Applies a filter to the list of products based on the user's input.
   *
   * @param event - The input event containing the filter value
   */
  applyFilter(event: Event) {
    const filterVal =
      (event.target as HTMLInputElement).value.trim().toLowerCase() || '';
    this.productService.filteredProducts =
      this.productService.allProducts.filter((product) =>
        product.name.toLowerCase().includes(filterVal)
      );
  }
}
