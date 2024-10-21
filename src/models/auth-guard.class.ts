import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin-data.service';

/**
 * AuthGuard is an Angular route guard that protects routes from unauthorized access.
 * It checks if the user is authenticated before granting access to certain routes.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  /**
   * Creates an instance of AuthGuard.
   *
   * @param router The Angular Router for navigation.
   * @param adminService The service responsible for managing admin authentication state.
   */
  constructor(private router: Router, private adminService: AdminService) {}

  /**
   * Determines if the route can be activated.
   *
   * @returns A boolean indicating whether the route can be activated (true) or not (false).
   * If the user is authenticated, the route is activated. Otherwise, the user is redirected to the login page.
   */
  canActivate(): boolean {
    if (this.adminService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
