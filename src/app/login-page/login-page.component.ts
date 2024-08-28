import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../services/admin-data.service';
import { Admin } from '../../models/admin.class';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  loginForm: FormGroup;
  admin = new Admin();
  wrongEmail:string | null = null;
  wrongPassword:string | null = null;

  ngOnInit(): void {
    this.startAnimation();
    this.adminService.subAdminList();
  }

  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

    getEmailErrorMessage() {
      if (this.emailControl.hasError('required')) {
        return 'You must enter an email';
      }
      if (this.emailControl.hasError('email')) {
        return 'Not a valid email';
      }
      return '';
    }
  
    getPasswordErrorMessage() {
      return this.passwordControl.hasError('required') ? 'Password is required' : '';
    }

    onInput() {
      this.validateEmail();
      this.validatePassword();
    }

    private validateEmail() {
      let email = this.emailControl.value;
      let admin = this.adminService.allAdmins.find(admin => admin.email === email);
  
      this.wrongEmail = admin ? null : 'No account found with this email';
    }

    private validatePassword() {
      let email = this.emailControl.value;
      let password = this.passwordControl.value;
      let admin = this.adminService.allAdmins.find(admin => admin.email === email);
  
      if (admin && admin.password !== password) {
        this.wrongPassword = 'Invalid password';
      } else {
        this.wrongPassword = null;
      }
    }

    async login() {
      if (this.loginForm.valid) {
        this.validateEmail();
        this.validatePassword();  
  
        if (!this.wrongEmail && !this.wrongPassword) {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.emailControl.markAsTouched();
        this.passwordControl.markAsTouched();
      }
    }

  startAnimation() {
    let startElement = document.querySelector('.animate-container');
    let loginElement = document.querySelector('.login-container');
  
    gsap.set(loginElement, { opacity: 0 });
  
    gsap
      .timeline()
      .fromTo(startElement, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.5 })
      .to(startElement, { opacity: 1, duration: 1 })
      .to(startElement, { opacity: 0, duration: 1 })
      .fromTo(loginElement, { y: '0%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 });
  }
}
