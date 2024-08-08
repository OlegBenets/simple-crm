import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import {MatCardModule} from '@angular/material/card';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { CommonModule } from '@angular/common';
import { onSnapshot } from "firebase/firestore";
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  firestore: Firestore = inject(Firestore);
  user = new User();
  allUsers: User[] = [];
  unsubUserList;

  constructor(public dialog: MatDialog) {
    this.unsubUserList = this.subUserList();
  }

  subUserList() {
    return onSnapshot(this.getUserRef(), (list: any) => {
      this.allUsers = [];
      list.forEach((element: any) => {
        console.log(element);
        let userData = element.data();
        let userId = element.id;
        let user = new User({...userData, id: userId});
        this.allUsers.push(user);
        // Spread-Operator ...userData copies all properties from userData
      });
    });
  }

  ngOnDestroy() {
    this.unsubUserList();
  }

  getUserRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent)
  }
}
