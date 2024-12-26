import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {AdminComponent} from './admin/admin.component';
import {CongresosComponent} from './admin/congresos/congresos.component';
import {SalasComponent} from './admin/salas/salas.component';
import {LoginComponent} from './admin/login/login.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'congresos', component: CongresosComponent },
      { path: 'salas', component: SalasComponent },
    ]
  },
  { path: 'landing', component: LandingComponent }
];
