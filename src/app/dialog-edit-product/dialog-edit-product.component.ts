import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../models/product.class';

@Component({
  selector: 'app-dialog-edit-product',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './dialog-edit-product.component.html',
  styleUrl: './dialog-edit-product.component.scss',
})
export class DialogEditProductComponent {
  /**
   * Constructs the DialogEditProductComponent.
   * @param dialogRef - Reference to the dialog to close it after saving the product.
   * @param productService - The service to handle product data operations.
   */
  constructor(
    public dialogRef: MatDialogRef<DialogEditProductComponent>,
    public productService: ProductDataService
  ) {}

  product = new Product();
  productId = '';
  loading: boolean = false;

  /**
   * Saves the product with updated data.
   * This method checks if the form is valid, sets the loading state, and calls the product service to update the product.
   * @param productForm - The form containing product data.
   */
  async saveProduct(productForm: NgForm) {
    if (productForm.form.valid) {
      this.loading = true;

      await this.productService.updateProduct(this.productId, this.product);
      this.loading = false;
      this.dialogRef.close();
    }
  }

  /**
   * Formats the product price to ensure it is a valid monetary value.
   * This method cleans the price input, replaces commas with dots, and formats it to two decimal places.
   * If the price is invalid, it clears the price field.
   */
  formatPrice() {
    let value = this.product.price.toString().replace(/[^\d.,]/g, '');
    value = value.replace(',', '.');

    if (value && !isNaN(parseFloat(value))) {
      this.product.price = parseFloat(value).toFixed(2) + ' €';
    } else {
      this.product.price = '';
    }
  }
}
