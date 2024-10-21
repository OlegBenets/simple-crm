import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../models/user.class';
import { UserService } from '../../services/user-data.service';

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
  styleUrl: './dialog-edit-address.component.scss',
})
export class DialogEditAddressComponent {
  /**
   * Constructs the DialogEditAddressComponent.
   * @param dialogRef - Reference to the dialog to close it after saving the user's address.
   * @param userService - The service to handle user data operations.
   */
  constructor(
    public dialogRef: MatDialogRef<DialogEditAddressComponent>,
    public userService: UserService
  ) {}
  user: User = new User();
  userId: string = '';
  loading: boolean = false;

  /**
   * Saves the user's address using the data from the form.
   * This method checks if the form is valid, sets the loading state,
   * and calls the user service to update the user's address.
   * @param userForm - The form containing user address data.
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
