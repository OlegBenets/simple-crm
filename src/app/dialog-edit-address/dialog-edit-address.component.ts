import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  styleUrl: './dialog-edit-address.component.scss'
})
export class DialogEditAddressComponent {
  constructor(public dialogRef: MatDialogRef<DialogEditAddressComponent>, public userService: UserService) {}
  user: User= new User();
  userId: string = '';
  loading: boolean = false;


  async saveUser() {
    this.loading = true;

   await this.userService.updateUser(this.userId, this.user);
      this.loading = false;
      this.dialogRef.close();
    }
}
