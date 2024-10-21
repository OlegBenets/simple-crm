import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../services/admin-data.service';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  hide = signal(true);
  loginForm: FormGroup;

  /**
   * Constructs the LoginPageComponent.
   * Initializes the form group and injects the necessary services.
   *
   * @param fb - FormBuilder service for managing form controls
   * @param adminService - Service to handle admin data operations
   * @param router - Router service for navigation
   */
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.adminService.subAdminList();
    this.checkAnimationStatus();

    window.addEventListener('beforeunload', () => {
      this.adminService.resetAnimationStatus();
    });
  }

  /**
   * Toggles the visibility of the password field.
   *
   * @param event - Mouse event for stopping propagation
   */
  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  /**
   * Returns the FormControl for email.
   */
  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  /**
   * Returns the FormControl for password.
   */
  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

  /**
   * Returns error messages for the email control based on validation.
   */
  getEmailErrorMessage() {
    if (this.emailControl.hasError('required')) {
      return 'You must enter an email';
    }
    if (this.emailControl.hasError('email')) {
      return 'Not a valid email';
    }
    if (this.emailControl.hasError('emailNotExists')) {
      return 'No account found with this email';
    }
    return '';
  }

  /**
   * Returns error messages for the password control based on validation.
   */
  getPasswordErrorMessage() {
    if (this.passwordControl.hasError('required')) {
      return 'Password is required';
    }
    if (this.passwordControl.hasError('invalidPassword')) {
      return 'Wrong password';
    }
    return '';
  }

  /**
   * Validates email controls on input.
   */
  onInput() {
    this.validateEmail();
  }

  /**
   * Marks a form control as touched and updates its validity.
   *
   * @param field - The name of the form control field to focus
   */
  onFocus(field: string) {
    let control = this.loginForm.get(field) as FormControl;
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  /**
   * Validates the email control against the list of admins.
   * Sets an error if the email does not exist in the list.
   */
  private validateEmail() {
    let email = this.emailControl.value;
    let admin = this.adminService.allAdmins.find(
      (admin) => admin.email === email
    );

    if (
      this.emailControl.hasError('required') ||
      this.emailControl.hasError('email')
    ) {
      return;
    }

    if (!admin) {
      this.emailControl.setErrors({ emailNotExists: true });
    } else {
      this.emailControl.setErrors(null);
    }
  }

  /**
   * Validates the password control against the email.
   * Sets an error if the password does not match the email's password.
   */
  private validatePassword() {
    let email = this.emailControl.value;
    let password = this.passwordControl.value;
    let admin = this.adminService.allAdmins.find(
      (admin) => admin.email === email
    );

    if (admin && admin.password !== password) {
      this.passwordControl.setErrors({ invalidPassword: true });
    } else {
      this.passwordControl.setErrors(null);
    }
  }

  /**
   * Validates the login credentials and navigates to the dashboard on success.
   */
  async login() {
    this.validateEmail();
    this.validatePassword();

    if (!this.emailControl.errors && !this.passwordControl.errors) {
      let admin = await this.adminService.validateAdmin(
        this.emailControl.value,
        this.passwordControl.value
      );
      if (admin) {
        this.adminService.resetAnimationStatus();
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.emailControl.markAsTouched();
      this.passwordControl.markAsTouched();
    }
  }

  /**
   * Starts the login animation using GSAP.
   */
  startAnimation() {
    let startElement = document.querySelector('.animate-container');
    let loginElement = document.querySelector('.login-container');

    gsap.set(loginElement, { opacity: 0 });

    gsap
      .timeline()
      .fromTo(
        startElement,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.5 }
      )
      .to(startElement, { opacity: 1, duration: 1 })
      .to(startElement, { opacity: 0, duration: 1 })
      .fromTo(
        loginElement,
        { y: '0%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1 }
      );
  }

  /**
   * Checks if the animation has already played and starts it if not.
   */
  checkAnimationStatus() {
    let animationPlayed = localStorage.getItem('animationPlayed');

    if (!animationPlayed) {
      this.startAnimation();
      localStorage.setItem('animationPlayed', 'true');
    }
  }
}
