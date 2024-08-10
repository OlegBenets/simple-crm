import { Component, inject } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.class';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  firestore: Firestore = inject(Firestore);
  userId = '';
  user = new User();

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id') || '';

      this.getUser();
    })
  }

  getUser() {
    onSnapshot(this.getSingleDocRef(), (doc) => {
      if (doc.exists()) {
        this.user = new User({ id: doc.id, ...doc.data() });
      } else {
        this.user = new User(); 
      }
    });
  }

  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.userId);
  }

  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  editMenu() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  async deleteUser() {
    await deleteDoc(this.getSingleDocRef()).catch(
      (err) => {console.log(err)}
    )
    this.router.navigate(['/user']);
  }
}