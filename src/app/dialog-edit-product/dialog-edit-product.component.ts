import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  styleUrl: './dialog-edit-product.component.scss'
})
export class DialogEditProductComponent {
  constructor(public dialogRef: MatDialogRef<DialogEditProductComponent>, public productService: ProductDataService) {}

  product = new Product();
  productId = '';
  loading: boolean = false;

 async saveProduct() {
    this.loading = true;

   await this.productService.updateProduct(this.productId, this.product);
      this.loading = false;
      this.dialogRef.close();
    }
}
