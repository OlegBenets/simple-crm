import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../models/product.class';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TooltipComponent,
    MatTooltipModule,
    MatCardModule,
    CommonModule,
    RouterModule,
    MatFormField,
    MatInputModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  product = new Product();

  constructor(public dialog: MatDialog, public productService: ProductDataService) {}

  openDialog() {
    this.dialog.open(DialogAddProductComponent)
  }

  applyFilter(event: Event) {
    // const filterVal = (event.target as HTMLInputElement).value.trim().toLowerCase() || '';
    // this.userService.filteredUsers = this.userService.allUsers.filter( user => 
    //   user.firstName.toLowerCase().includes(filterVal) ||
    //   user.lastName.toLowerCase().includes(filterVal) ||
    //   user.city.toLowerCase().includes(filterVal) 
    // );
    }

}
