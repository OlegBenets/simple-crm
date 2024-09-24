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
  styleUrl: './dialog-add-product.component.scss'
})
export class DialogAddProductComponent {

  constructor(public dialogRef: MatDialogRef<DialogAddProductComponent>, public productService: ProductDataService){}

  product = new Product();
  details:string[] = [];
  loading: boolean = false;

 async addProduct(productForm: NgForm) {
    if (productForm.form.valid) {
      this.loading = true;
  
    await this.productService.addProduct(this.product);
        this.dialogRef.close();
        this.loading = false;
  }
}

addDetail(detail: string) {
  if (detail.trim() !== '' && !this.details.includes(detail)) {
    this.details.push(detail);
    this.product.detail = '';
    }
}

deleteDetail(detail: string) {
  let index = this.details.indexOf(detail);
  if (index !== -1) {
    this.details.splice(index, 1);
  }
}

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