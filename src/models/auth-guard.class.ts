import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(private router: Router, private adminService: AdminService) {}

  canActivate(): boolean {
    if (this.adminService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}