import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
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
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  isMobileView: boolean = false;
  isDrawerOpen: boolean = true;  

  constructor(public router: Router, private adminService: AdminService,) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  async logOut() {
    try {
      await this.adminService.logOut();
      this.router.navigate(['/login']);
    } catch (err) {
      console.log(err);
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/signup' || this.router.url === '/login';
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 800;
    if (this.isMobileView) {
      this.isDrawerOpen = false;
    }
  }

  toggleDrawer() {
    this.drawer.toggle();
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  closeDrawerIfMobile() {
    if (this.isMobileView && this.isDrawerOpen) {
      this.toggleDrawer();
    }
  }
}
