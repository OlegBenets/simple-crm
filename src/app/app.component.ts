import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../services/admin-data.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatIconModule,
    RouterModule,
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simple-crm';
  isLoggingOut = false;

  constructor(public router: Router, private adminService: AdminService,) {}

  async logOut() {
    this.isLoggingOut = true; 
    try {
      await this.adminService.logOut();
      this.router.navigate(['/login']);
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoggingOut = false
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/' || this.router.url === '/signup' || this.router.url === '/login';
  }
}
