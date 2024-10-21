import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin-data.service';
import { Admin } from '../../models/admin.class';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './singup-page.component.html',
  styleUrl: './singup-page.component.scss',
})
export class SingupPageComponent {
  admin = new Admin();
  signupForm: FormGroup;
  passwordPattern: string =
    '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@!#\\$%^&*])[A-Za-z\\d@!#\\$%^&*]{8,}$';
  emailPattern: string = '^[a-z]+(.[a-z]+)?@[a-z]{1,10}.[a-z]{2,3}$';
  hide = signal(true);

  /**
   * Constructs the SingupPageComponent.
   *
   * @param fb - FormBuilder service for managing reactive forms
   * @param adminService - Service for handling admin-related data and operations
   * @param router - Router service for navigation
   */
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(14),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    });
  }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Subscribes to the admin list to initialize data.
   */
  ngOnInit(): void {
    this.adminService.subAdminList();
  }

  /**
   * Toggles the visibility of the password field.
   *
   * @param event - MouseEvent to stop propagation
   */
  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  /**
   * Getter for the first name form control.
   *
   * @returns The FormControl associated with the 'firstName' field.
   */
  get firstNameControl() {
    return this.signupForm.get('firstName') as FormControl;
  }

  /**
   * Getter for the last name form control.
   *
   * @returns The FormControl associated with the 'lastName' field.
   */
  get lastNameControl() {
    return this.signupForm.get('lastName') as FormControl;
  }

  /**
   * Getter for the email form control.
   *
   * @returns The FormControl associated with the 'email' field.
   */
  get emailControl() {
    return this.signupForm.get('email') as FormControl;
  }

  /**
   * Getter for the password form control.
   *
   * @returns The FormControl associated with the 'password' field.
   */
  get passwordControl() {
    return this.signupForm.get('password') as FormControl;
  }

  /**
   * Retrieves error messages based on validation state of the given control.
   *
   * @param controlName - The name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string) {
    let control: any = this.signupForm.get(controlName);
    if (control.hasError('required')) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} is required`;
    }
    if (control.hasError('minlength')) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} must be min. ${
        control.errors?.['minlength'].requiredLength
      } characters long`;
    }
    if (control.hasError('maxlength')) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} must be max. ${
        control.errors?.['maxlength'].requiredLength
      } characters long`;
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

  /**
   * Validates if the email entered already exists in the system.
   */
  private validateEmail() {
    let email = this.emailControl.value;
    let admin = this.adminService.allAdmins.find(
      (admin) => admin.email === email
    );

    if (
      this.emailControl.hasError('required') ||
      this.emailControl.hasError('pattern')
    ) {
      return;
    }

    if (admin) {
      this.emailControl.setErrors({ emailExists: true });
    } else {
      this.emailControl.setErrors(null);
    }
  }

  /**
   * Validates the password against the specified pattern.
   */
  private validatePassword() {
    let password = this.passwordControl.value;
    let pattern = new RegExp(this.passwordPattern);

    if (this.passwordControl.hasError('required')) {
      return;
    }

    if (!pattern.test(password)) {
      this.passwordControl.setErrors({ passwordPattern: true });
    } else {
      this.passwordControl.setErrors(null);
    }
  }

  /**
   * Validates the email and password fields on input change.
   */
  async onInput() {
    this.validateEmail();
    this.validatePassword();
  }

  /**
   * Marks the specified form field as touched and updates its validity.
   *
   * @param field - The name of the form field
   */
  onFocus(field: string) {
    let control = this.signupForm.get(field) as FormControl;
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  /**
   * Handles the signup process. Validates the form and submits the data.
   */
  async signup() {
    this.validateEmail();
    this.validatePassword();

    if (
      !this.emailControl.errors &&
      !this.passwordControl.errors &&
      !this.firstNameControl.errors &&
      !this.lastNameControl.errors
    ) {
      const admin = new Admin(this.signupForm.value);
      await this.adminService.addAdmin(admin);
      await this.adminService.logOut();
      this.router.navigate(['/login']);
    } else {
      this.emailControl.markAsTouched();
      this.passwordControl.markAsTouched();
    }
  }
}
