import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { UserService } from '../../services/user-data.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  userId = '';
  user = new User();

  /**
   * Constructor for UserDetailComponent.
   * @param route - The ActivatedRoute service to access route parameters.
   * @param dialog - The MatDialog service to open dialogs.
   * @param router - The Router service for navigation.
   * @param userService - The UserService to manage user data.
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    public userService: UserService
  ) {}

  /**
   * ngOnInit lifecycle hook.
   * Initializes the component by retrieving the user ID from the route parameters
   * and fetching the user details.
   */
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id') || '';
      this.getUser();
    });
  }

  /**
   * Fetches the user details based on userId and assigns it to the user property.
   */
  async getUser() {
    this.user = await this.userService.getSingleUser(this.userId);
  }

  /**
   * Opens a dialog to edit the user's details.
   */
  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
    this.handleDialogClose(dialog);
  }

  /**
   * Opens a dialog to edit the user's address.
   */
  editMenu() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
    this.handleDialogClose(dialog);
  }

  /**
   * Handles the closing of the dialog and refreshes the user details.
   * @param dialogRef - The reference to the opened dialog.
   */
  handleDialogClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.getUser();
    });
  }

  /**
   * Deletes the user with the given userId and navigates back to the user list.
   */
  async deleteUser() {
    await this.userService.deleteUser(this.userId);
    this.router.navigate(['/user']);
  }
}
