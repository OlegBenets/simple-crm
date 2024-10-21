import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { User } from '../../models/user.class';
import { FormsModule, NgForm } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserService } from '../../services/user-data.service';

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
  user = new User();
  loading: boolean = false;

  /**
   * Constructs the DialogAddUserComponent.
   * @param dialogRef - Reference to the dialog to close it after saving the user.
   * @param userService - The service to handle user data operations.
   */
  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    public userService: UserService
  ) {}

  /**
   * Saves the user using the data from the form.
   * This method checks if the form is valid, sets the loading state,
   * and calls the user service to add the user.
   * @param userForm - The form containing user data.
   */
  async saveUser(userForm: NgForm) {
    if (userForm.form.valid) {
      this.loading = true;

      await this.userService.addUser(this.user);
      this.dialogRef.close();
      this.loading = false;
    }
  }
}
