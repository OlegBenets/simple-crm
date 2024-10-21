import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../models/user.class';
import { UserService } from '../../services/user-data.service';

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
  styleUrl: './dialog-edit-user.component.scss',
})
export class DialogEditUserComponent {
  /**
   * Constructs the DialogEditUserComponent.
   * @param dialogRef - Reference to the dialog to close it after saving the user.
   * @param userService - The service to handle user data operations.
   */
  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    public userService: UserService
  ) {}

  user: User = new User();
  userId: string = '';
  loading: boolean = false;

  /**
   * Saves the user with updated data.
   * This method checks if the form is valid, sets the loading state, and calls the user service to update the user.
   * @param userForm - The form containing user data.
   */
  async saveUser(userForm: NgForm) {
    if (userForm.form.valid) {
      this.loading = true;

      await this.userService.updateUser(this.userId, this.user);
      this.loading = false;
      this.dialogRef.close();
    }
  }
}
