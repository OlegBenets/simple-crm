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
    RouterModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  product = new Product();
  productId = '';

  /**
   * Constructs the ProductDetailComponent.
   *
   * @param route - ActivatedRoute service to access the route parameters
   * @param dialog - MatDialog service for opening dialogs
   * @param router - Router service for navigation
   * @param productService - Service for managing product data
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    public productService: ProductDataService
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Subscribes to route parameters to fetch the product ID.
   */
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.productId = paramMap.get('id') || '';

      this.getProduct();
    });
  }

  /**
   * Fetches the product details based on the product ID.
   */
  async getProduct() {
    this.product = await this.productService.getSingleProduct(this.productId);
  }

  /**
   * Opens a dialog for editing the product.
   */
  editProduct() {
    const dialog = this.dialog.open(DialogEditProductComponent);
    dialog.componentInstance.product = new Product(this.product.toJSON());
    dialog.componentInstance.productId = this.productId;
    this.handleDialogClose(dialog);
  }

  /**
   * Opens a dialog for editing the product description.
   */
  editDescription() {
    const dialog = this.dialog.open(DialogEditDescriptionComponent);
    dialog.componentInstance.product = new Product(this.product.toJSON());
    dialog.componentInstance.productId = this.productId;
    this.handleDialogClose(dialog);
  }

  /**
   * Handles the dialog close event and refreshes the product data.
   *
   * @param dialogRef - Reference to the opened dialog
   */
  handleDialogClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.getProduct();
    });
  }

  /**
   * Deletes the product and navigates back to the products list.
   */
  async deleteProduct() {
    await this.productService.deleteProduct(this.productId);
    this.router.navigate(['/products']);
  }
}
