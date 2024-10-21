import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
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
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  isMobileView: boolean = false;
  isDrawerOpen: boolean = true;

  /**
   * Constructor for AppComponent.
   * @param router - The Router service for navigation.
   * @param adminService - The AdminService to manage admin authentication.
   */
  constructor(public router: Router, private adminService: AdminService) {}

  /**
   * ngOnInit lifecycle hook.
   * Initializes the component by checking the screen size and adding an event listener for window resize.
   */
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  /**
   * Logs out the current admin user and navigates to the login page.
   */
  async logOut() {
    try {
      await this.adminService.logOut();
      this.router.navigate(['/login']);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Checks if the current route is the login or signup page.
   * @returns {boolean} - True if on the login or signup page, false otherwise.
   */
  isLoginPage(): boolean {
    return this.router.url === '/signup' || this.router.url === '/login';
  }

  /**
   * Checks the screen size and updates the isMobileView and isDrawerOpen flags.
   * Closes the drawer if the view is mobile.
   */
  checkScreenSize() {
    this.isMobileView = window.innerWidth < 800;
    if (this.isMobileView) {
      this.isDrawerOpen = false;
    }
  }

  /**
   * Toggles the open/close state of the drawer.
   */
  toggleDrawer() {
    this.drawer.toggle();
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  /**
   * Closes the drawer if the current view is mobile and the drawer is open.
   */
  closeDrawerIfMobile() {
    if (this.isMobileView && this.isDrawerOpen) {
      this.toggleDrawer();
    }
  }
}
