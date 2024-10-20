import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Product } from '../../models/product.class';
import { ProductDataService } from '../../services/product-data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditProductComponent } from '../dialog-edit-product/dialog-edit-product.component';
import { DialogEditDescriptionComponent } from '../dialog-edit-description/dialog-edit-description.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  product = new Product();
  productId = '';

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router, public productService: ProductDataService) {}

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.productId = paramMap.get('id') || '';

       this.getProduct();
    })
  }

  async getProduct() {
    this.product = await this.productService.getSingleProduct(this.productId);
  }

  editProduct() {
    const dialog = this.dialog.open(DialogEditProductComponent);
    dialog.componentInstance.product = new Product(this.product.toJSON());
    dialog.componentInstance.productId = this.productId;
    this.handleDialogClose(dialog);
  }

  editDescription() {
    const dialog = this.dialog.open(DialogEditDescriptionComponent);
    dialog.componentInstance.product = new Product(this.product.toJSON());
    dialog.componentInstance.productId = this.productId;
    this.handleDialogClose(dialog);
  }

  handleDialogClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.getProduct();
    });
  }

  async deleteProduct() {
   await this.productService.deleteProduct(this.productId);
    this.router.navigate(['/products']);
  }
}
