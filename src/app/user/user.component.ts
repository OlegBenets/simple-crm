import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import {MatCardModule} from '@angular/material/card';
import { User } from '../../models/user.class';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-data.service';

@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  user = new User();
  sortAscending: boolean = true;
  isMobile: boolean = false;

  constructor(public dialog: MatDialog, public userService: UserService) {}

  ngOnInit() {
    this.userService.filteredUsers = this.userService.allUsers;

    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent)
  }

   applyFilter(event: Event) {
    const filterVal = (event.target as HTMLInputElement).value.trim().toLowerCase() || '';
    this.userService.filteredUsers = this.userService.allUsers.filter( user => 
      user.firstName.toLowerCase().includes(filterVal) ||
      user.lastName.toLowerCase().includes(filterVal) ||
      user.city.toLowerCase().includes(filterVal) 
    );
    }

    sortName() {
      this.userService.filteredUsers = this.userService.filteredUsers.sort((a, b) => {
        let firstNameComparison = a.firstName.localeCompare(b.firstName);
        
        return this.sortAscending ? firstNameComparison : -firstNameComparison;
      });
  
      this.sortAscending = !this.sortAscending;
    }

    checkScreenSize() {
      this.isMobile = window.innerWidth < 800;
    }
  }
