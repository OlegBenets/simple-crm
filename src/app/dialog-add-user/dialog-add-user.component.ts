import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../../models/user.class';
import { FormsModule, NgForm } from '@angular/forms';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-dialog-add-user',
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
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  firestore: Firestore = inject(Firestore);
  user = new User();
  birthDate: Date = new Date();
  loading: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogAddUserComponent>) {}

  async saveUser(userForm: NgForm) {
    if (userForm.form.valid) {
    this.user.birthDate = this.birthDate.getTime();
    this.loading = true;

      await addDoc(this.getUserRef(), this.user.toJSON()).catch(
        (err) => {
        console.log(err);
      });
      this.dialogRef.close();
      this.loading = false;
     }
    }

  getUserRef() {
    return collection(this.firestore, 'users');
  }
}
