import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../models/product.class';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-edit-description',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIcon,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './dialog-edit-description.component.html',
  styleUrl: './dialog-edit-description.component.scss',
})
export class DialogEditDescriptionComponent implements OnInit {
  /**
   * Constructs the DialogEditDescriptionComponent.
   * @param dialogRef - Reference to the dialog to close it after saving the product description.
   * @param productService - The service to handle product data operations.
   */
  constructor(
    public dialogRef: MatDialogRef<DialogEditDescriptionComponent>,
    public productService: ProductDataService
  ) {}

  product = new Product();
  productId = '';
  currentDetail: string = '';
  loading: boolean = false;
  editingDetail: string | null = null;
  editingValue: string = '';
  temporaryDetails: string[] = [];

  /**
   * Initializes the component.
   * This lifecycle hook is called after the component is constructed and is used to set up the initial state.
   */
  ngOnInit(): void {
    this.temporaryDetails = [...this.product.detail];
  }

  /**
   * Saves the product with updated details.
   * This method checks if the form is valid, sets the loading state, and calls the product service to update the product.
   * @param productForm - The form containing product data.
   */
  async saveProduct(productForm: NgForm) {
    if (productForm.form.valid) {
      this.loading = true;
      this.product.detail = [...this.temporaryDetails];

      await this.productService.updateProduct(this.productId, this.product);
      this.loading = false;
      this.dialogRef.close();
    }
  }

  /**
   * Adds a new detail to the temporary details array.
   * This method ensures that the detail is not empty and does not already exist in the list.
   */
  addDetail() {
    if (
      this.currentDetail.trim() !== '' &&
      !this.temporaryDetails.includes(this.currentDetail)
    ) {
      this.temporaryDetails.push(this.currentDetail);
      this.currentDetail = '';
    }
  }

  /**
   * Sets the detail to be edited.
   * This method initializes the editing process by storing the detail to be edited and its value.
   * @param detail - The detail to be edited.
   */
  setEditing(detail: string) {
    this.editingDetail = detail;
    this.editingValue = detail;
  }

  /**
   * Finishes editing a detail and updates the temporary details array.
   * This method checks if the editing value is not empty and updates the corresponding detail.
   * @param originalDetail - The original detail before editing.
   */
  finishEditing(originalDetail: string) {
    if (this.editingValue.trim() !== '') {
      let index = this.temporaryDetails.indexOf(originalDetail);
      if (index !== -1) {
        this.temporaryDetails[index] = this.editingValue;
      }
    }
    this.cancelEditing();
  }

  /**
   * Cancels the editing process.
   * This method resets the editing state and clears the editing value.
   */
  cancelEditing() {
    this.editingDetail = null;
    this.editingValue = '';
  }

  /**
   * Deletes a detail from the temporary details array.
   * This method removes the specified detail if it exists in the temporary array.
   * @param detail - The detail to be deleted.
   */
  deleteDetail(detail: string) {
    let index = this.temporaryDetails.indexOf(detail);
    if (index !== -1) {
      this.temporaryDetails.splice(index, 1);
    }
  }
}
