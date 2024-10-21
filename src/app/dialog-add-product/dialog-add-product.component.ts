import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Product } from '../../models/product.class';
import { ProductDataService } from '../../services/product-data.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-add-product',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './dialog-add-product.component.html',
  styleUrl: './dialog-add-product.component.scss',
})
export class DialogAddProductComponent {
  /**
   * Constructs the DialogAddProductComponent.
   * @param dialogRef - Reference to the dialog to close it after adding the product.
   * @param productService - The service to handle product data operations.
   */
  constructor(
    public dialogRef: MatDialogRef<DialogAddProductComponent>,
    public productService: ProductDataService
  ) {}

  product = new Product();
  currentDetail: string = '';
  loading: boolean = false;

  /**
   * Adds a new product using the data from the form.
   * This method checks if the form is valid, sets loading state,
   * and calls the product service to add the product.
   * @param productForm - The form containing product data.
   */
  async addProduct(productForm: NgForm) {
    if (productForm.form.valid) {
      this.loading = true;

      await this.productService.addProduct(this.product);
      this.dialogRef.close();
      this.loading = false;
    }
  }

  /**
   * Adds a detail to the product's details array.
   * This method checks if the detail is not empty and
   * is not already included in the product's details.
   * @param currentDetail - The detail to be added to the product.
   */
  addDetail(currentDetail: string) {
    if (
      currentDetail.trim() !== '' &&
      !this.product.detail.includes(currentDetail)
    ) {
      this.product.detail.push(currentDetail);
      this.currentDetail = '';
    }
  }

  /**
   * Deletes a detail from the product's details array.
   * This method removes the detail if it exists in the product's details.
   * @param detail - The detail to be removed from the product.
   */
  deleteDetail(detail: string) {
    let index = this.product.detail.indexOf(detail);
    if (index !== -1) {
      this.product.detail.splice(index, 1);
    }
  }

  /**
   * Formats the product price as a string with two decimal places followed by ' €'.
   * This method cleans the input value and converts it to a number.
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
