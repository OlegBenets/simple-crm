import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import {MatCardModule} from '@angular/material/card';
import { Firestore, collection } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { CommonModule } from '@angular/common';
import { onSnapshot } from "firebase/firestore";
import { RouterModule } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
export class UserComponent {
  firestore: Firestore = inject(Firestore);
  user = new User();
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  unsubUserList;
  showNoUserMessage: boolean = false;
  sortAscending: boolean = true;

  constructor(public dialog: MatDialog) {
    this.unsubUserList = this.subUserList();
  }

  subUserList() {
      return onSnapshot(this.getUserRef(), (list: any) => {
        this.allUsers = [];
        list.forEach((element: any) => {
          let user = new User({...element.data(), id: element.id});
          this.allUsers.push(user);
        });
        this.filteredUsers = this.allUsers;
    });
  }

  ngOnDestroy() {
    this.unsubUserList();
  }

  getUserRef() {
    return collection(this.firestore, 'users');
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent)
  }

   applyFilter(event: Event) {
    const filterVal = (event.target as HTMLInputElement).value.trim().toLowerCase() || '';
    this.filteredUsers = this.allUsers.filter( user => 
      user.firstName.toLowerCase().includes(filterVal) ||
      user.lastName.toLowerCase().includes(filterVal) ||
      user.city.toLowerCase().includes(filterVal) 
    );
    }

    sortName() {
      this.filteredUsers = this.filteredUsers.sort((a, b) => {
        const firstNameComparison = a.firstName.localeCompare(b.firstName);
        
        return this.sortAscending ? firstNameComparison : -firstNameComparison;
      });
  
      this.sortAscending = !this.sortAscending;
    }
  }
