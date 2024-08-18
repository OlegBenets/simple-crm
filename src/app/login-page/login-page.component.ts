import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAnimation();
  }

  login() {
    localStorage.setItem('userToken', 'dummy-token'); 
    this.router.navigate(['/dashboard']);  
  }

  startAnimation() {
    let startElement = document.querySelector('.animate-container');
    let loginElement = document.querySelector('.login-container');
  
    gsap.set(loginElement, { opacity: 0 });
  
    gsap
      .timeline()
      .fromTo(startElement, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.5 })
      .to(startElement, { opacity: 1, duration: 2 })
      .to(startElement, { opacity: 0, duration: 1 })
      .fromTo(loginElement, { y: '0%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 });
  }
}
