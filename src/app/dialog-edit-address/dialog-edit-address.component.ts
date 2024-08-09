import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../models/user.class';
import { collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-edit-address',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './dialog-edit-address.component.html',
  styleUrl: './dialog-edit-address.component.scss'
})
export class DialogEditAddressComponent {
  constructor(public dialogRef: MatDialogRef<DialogEditAddressComponent>) {}
  firestore: Firestore = inject(Firestore);
  user: User= new User();
  userId: string = '';
  loading: boolean = false;


  async saveUser() {
    console.log('user', this.user);
    this.loading = true;

      await updateDoc(this.getSingleDocRef(), this.user.toJSON()).catch(
        (err) => {
        console.log(err);
      });
      this.loading = false;
      this.dialogRef.close();
    }

    getSingleDocRef() {
      return doc(collection(this.firestore, 'users'), this.userId);
    }
  
}
