import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../models/user.class';
import { collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {
  constructor(public dialogRef: MatDialogRef<DialogEditUserComponent>) {}
  firestore: Firestore = inject(Firestore);
  user: User = new User();
  userId: string = '';
  loading: boolean = false;
  birthDate: Date = new Date();

  async saveUser() {
    this.user.birthDate = this.birthDate.getTime();
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
