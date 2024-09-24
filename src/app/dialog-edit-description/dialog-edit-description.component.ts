import { Component } from '@angular/core';
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
  styleUrl: './dialog-edit-description.component.scss'
})
export class DialogEditDescriptionComponent {
  constructor(public dialogRef: MatDialogRef<DialogEditDescriptionComponent>, public productService: ProductDataService) {}

  product = new Product();
  productId = '';
  currentDetail: string = '';
  loading: boolean = false;

 async saveProduct(productForm: NgForm) {
  if (productForm.form.valid) {
    this.loading = true;

  await this.productService.updateProduct(this.productId, this.product);
      this.loading = false;
      this.dialogRef.close();
    }
  }

  addDetail() {
    if (this.currentDetail.trim() !== '' && !this.product.detail.includes(this.currentDetail)) {
      this.product.detail.push(this.currentDetail);
      this.currentDetail = '';
    }
  }

  editDetail(detail: string) {

  }

  deleteDetail(detail: string) {
    let index = this.product.detail.indexOf(detail);
    if (index !== -1) {
      this.product.detail.splice(index, 1);
    }
  }
}
