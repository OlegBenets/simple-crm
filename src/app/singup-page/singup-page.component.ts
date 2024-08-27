import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from  '../../services/admin-data.service';
import { Admin } from '../../models/admin.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singup-page',
  standalone: true,
  imports: [
    CommonModule,
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
  admin = new Admin();
  emailExists:string | null = null;
  weakPassword:string | null = null;


  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.adminService.subAdminList();
  }

  async signup(signupForm: NgForm) {
    if (signupForm.valid) {
      try {
        console.log('Admin list during signup:', this.adminService.allAdmins);

        let emailTaken = this.adminService.allAdmins.some(admin => admin.email === this.admin.email);
        if (emailTaken) {
          this.emailExists = 'This email is already in use';
          return;
        }

        await this.adminService.addAdmin(this.admin);
        this.router.navigate(['/']);
      } catch (err) {
        const error = err as any;
        if (error.code === 'auth/email-already-in-use') {
          this.emailExists = 'This email is already in use';
        } else if (error.code === 'auth/weak-password') {
          this.weakPassword = 'The password is too weak';
        } else {
          console.error('Signup error:', error);
        }
      }
    }
  }

}
