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
  passwordPattern: string = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@!#\\$%^&*])[A-Za-z\\d@!#\\$%^&*]{8,}$';
  emailPattern: string = '^[a-z]+(\.[a-z]+)?@[a-z]{1,10}\.[a-z]{2,3}$';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {
  
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(14)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
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
      return `${controlName.replace(/([A-Z])/g, ' $1')} is required`;
    }
    if (control.hasError('minlength')) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} must be min. ${control.errors?.['minlength'].requiredLength} characters long`;
    }
    if (control.hasError('maxlength')) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} must be max. ${control.errors?.['maxlength'].requiredLength} characters long`;
    }
    if (this.emailControl.hasError('pattern')) {
      return 'Invalid email format (e.g., user@example.com).';
    }
    if (this.emailControl.hasError('emailExists')) {
      return 'This email is already in use';
    }
    if (this.passwordControl.hasError('passwordPattern')) {
      return 'Invalid password format (e.g., Password1@).';
    }
    return '';
  }

  private validateEmail() {
    let email = this.emailControl.value;
    let admin = this.adminService.allAdmins.find(admin => admin.email === email);

    if (this.emailControl.hasError('required') || this.emailControl.hasError('pattern')) {
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
    let pattern = new RegExp(this.passwordPattern);

    if (this.passwordControl.hasError('required')) {
      return; 
    }

    if (!pattern.test(password)) {
      this.passwordControl.setErrors({ 'passwordPattern': true });
    } else {
      this.passwordControl.setErrors(null);
    }
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
        this.router.navigate(['/login']);
      } else {
        this.emailControl.markAsTouched();
        this.passwordControl.markAsTouched();
      }
  }
}
