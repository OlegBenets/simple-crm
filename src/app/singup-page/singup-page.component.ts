import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './singup-page.component.html',
  styleUrl: './singup-page.component.scss'
})

export class SingupPageComponent {
  admin = new Admin();
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {

    let emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(14)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.adminService.subAdminList();
  }

  get firstNameControl() {
    return this.signupForm.get('firstName') as FormControl;
  }

  get lastNameControl() {
    return this.signupForm.get('lastName') as FormControl;
  }

  get emailControl() {
    return this.signupForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.signupForm.get('password') as FormControl;
  }

  getErrorMessage(controlName: string) {
    let control: any = this.signupForm.get(controlName);
    if (control.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control.hasError('minlength')) {
      return `${controlName} must be min. ${control.errors?.['minlength'].requiredLength} characters long`;
    }
    if (control.hasError('maxlength')) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} must be max. ${control.errors?.['maxlength'].requiredLength} characters long`;
    }
    if (this.emailControl.hasError('email')) {
      return 'Not a valid email';
    }
    if (this.emailControl.hasError('pattern')) {
      return 'Email does not match the required pattern';
    }
    if (this.emailControl.hasError('emailExists')) {
      return 'This email is already in use';
    }
    if (this.passwordControl.hasError('invalidPassword')) {
      return 'Wrong password';
    }
    return '';
  }

  private validateEmail() {
    let email = this.emailControl.value;
    let admin = this.adminService.allAdmins.find(admin => admin.email === email);

    if (this.emailControl.hasError('required') || this.emailControl.hasError('email')) {
      return; 
    }

    if (admin) {
      this.emailControl.setErrors({ 'emailExists': true });
    } else {
      this.emailControl.setErrors(null);
    }
  }

  private validatePassword() {
    let password = this.passwordControl.value;
  }

  async onInput() {
    this.validateEmail();
    this.validatePassword();
  }

  onFocus(field: string) {
    let control = this.signupForm.get(field) as FormControl;
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  async signup() {
    this.validateEmail();
    this.validatePassword();

    if (!this.emailControl.errors && !this.passwordControl.errors && !this.firstNameControl.errors && !this.lastNameControl.errors) {
        const admin = new Admin(this.signupForm.value);
        await this.adminService.addAdmin(admin);
        this.router.navigate(['/']);
      } else {
        this.emailControl.markAsTouched();
        this.passwordControl.markAsTouched();
      }
  }
}
