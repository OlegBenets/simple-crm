import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/user.class';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-data.service';

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
    RouterModule,
    MatFormField,
    MatInputModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  user = new User();
  sortAscending: boolean = true;
  isMobile: boolean = false;

  /**
   * Constructor for UserComponent.
   * @param dialog - The MatDialog service to open dialogs.
   * @param userService - The UserService to manage user data.
   */
  constructor(public dialog: MatDialog, public userService: UserService) {}

  /**
   * ngOnInit lifecycle hook.
   * Initializes the component by setting the filtered users list to all users
   * and checking the screen size. It also adds an event listener to handle
   * changes in screen size.
   */
  ngOnInit() {
    this.userService.filteredUsers = this.userService.allUsers;

    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  /**
   * Opens a dialog to add a new user.
   */
  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }

  /**
   * Applies a filter to the user list based on user input.
   * @param event - The input event from the filter field.
   */
  applyFilter(event: Event) {
    const filterVal =
      (event.target as HTMLInputElement).value.trim().toLowerCase() || '';
    this.userService.filteredUsers = this.userService.allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filterVal) ||
        user.lastName.toLowerCase().includes(filterVal) ||
        user.city.toLowerCase().includes(filterVal)
    );
  }

  /**
   * Sorts the filtered users list by first name.
   * Toggles the sorting order between ascending and descending.
   */
  sortName() {
    this.userService.filteredUsers = this.userService.filteredUsers.sort(
      (a, b) => {
        let firstNameComparison = a.firstName.localeCompare(b.firstName);

        return this.sortAscending ? firstNameComparison : -firstNameComparison;
      }
    );

    this.sortAscending = !this.sortAscending;
  }

  /**
   * Checks the screen size and sets the isMobile flag accordingly.
   */
  checkScreenSize() {
    this.isMobile = window.innerWidth < 800;
  }
}
