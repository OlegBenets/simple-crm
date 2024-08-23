import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../models/admin-data.service';
import { Admin } from '../../models/admin.class';

@Component({
  selector: 'app-singup-page',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './singup-page.component.html',
  styleUrl: './singup-page.component.scss'
})

export class SingupPageComponent {

  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  signup() {
    const newAdmin = new Admin({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    });

    this.adminService.addAdmin(newAdmin).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
