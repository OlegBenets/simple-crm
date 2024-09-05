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

@Component({
  selector: 'app-dialog-add-product',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './dialog-add-product.component.html',
  styleUrl: './dialog-add-product.component.scss'
})
export class DialogAddProductComponent {

  constructor(public dialogRef: MatDialogRef<DialogAddProductComponent>, public productService: ProductDataService){}

  product = new Product();
  loading: boolean = false;

  addProduct(productForm: NgForm) {
    if (productForm.form.valid) {
      this.loading = true;
  
      this.productService.addProduct(this.product);
        this.dialogRef.close();
        this.loading = false;
  }
}
}