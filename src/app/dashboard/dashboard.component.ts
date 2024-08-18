import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { User } from '../../models/user.class';
import { UserService } from '../../models/user-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatGridListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(public userService: UserService) {}

  user = new User();
  allUsers: User[] = [];
}
