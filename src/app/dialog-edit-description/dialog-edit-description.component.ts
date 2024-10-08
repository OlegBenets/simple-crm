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
  styleUrl: './dialog-edit-description.component.scss'
})
export class DialogEditDescriptionComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogEditDescriptionComponent>, public productService: ProductDataService) {}

  product = new Product();
  productId = '';
  currentDetail: string = '';
  loading: boolean = false;
  editingDetail: string | null = null;  
  editingValue: string = ''; 
  temporaryDetails: string[] = [];

  ngOnInit(): void {
    this.temporaryDetails = [...this.product.detail]; 
  }

 async saveProduct(productForm: NgForm) {
  if (productForm.form.valid) {
    this.loading = true;
    this.product.detail = [...this.temporaryDetails];

  await this.productService.updateProduct(this.productId, this.product);
      this.loading = false;
      this.dialogRef.close();
    }
  }

  addDetail() {
    if (this.currentDetail.trim() !== '' && !this.temporaryDetails.includes(this.currentDetail)) {
      this.temporaryDetails.push(this.currentDetail);
      this.currentDetail = '';
    }
  }

  setEditing(detail: string) {
    this.editingDetail = detail;           
    this.editingValue = detail;       
  }

  finishEditing(originalDetail: string) {
    if (this.editingValue.trim() !== '') {
      let index = this.temporaryDetails.indexOf(originalDetail);
      if (index !== -1) {
        this.temporaryDetails[index] = this.editingValue;  
      }
    }
    this.cancelEditing();  
  }

  cancelEditing() {
    this.editingDetail = null;              
    this.editingValue = '';           
  }

  deleteDetail(detail: string) {
    let index = this.temporaryDetails.indexOf(detail);
    if (index !== -1) {
      this.temporaryDetails.splice(index, 1);
    }
  }
}
