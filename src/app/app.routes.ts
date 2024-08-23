import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from '../models/auth-guard.class';
import { SingupPageComponent } from './singup-page/singup-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy', component: PrivacyPolicyComponent },
    { path: 'signup', component: SingupPageComponent },
];
