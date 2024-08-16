import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { User } from '../../models/user.class';

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
  user = new User();
  allUsers: User[] = [];
}
