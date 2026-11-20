import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Appointments } from './pages/appointments/appointments';
import { Customers } from './pages/customers/customers';
import { Staff } from './pages/staff/staff';
import { Services } from './pages/services/services';
import { Availability } from './pages/availability/availability';
import { Settings } from './pages/settings/settings';
import { Login } from './pages/login/login';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'appointments', component: Appointments },
      { path: 'customers', component: Customers },
      { path: 'staff', component: Staff },
      { path: 'services', component: Services },
      { path: 'availability', component: Availability },
      { path: 'settings', component: Settings },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
