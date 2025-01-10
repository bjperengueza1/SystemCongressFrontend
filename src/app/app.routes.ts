import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {AdminComponent} from './admin/admin.component';
import {CongresosComponent} from './admin/congresos/congresos.component';
import {SalasComponent} from './admin/salas/salas.component';
import {LoginComponent} from './admin/login/login.component';
import {authGuard} from './guards/auth.guard';
import {RegistroExposicionComponent} from './congresos/registro-exposicion/registro-exposicion.component';
import {PresentacionesComponent} from './admin/presentaciones/presentaciones.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'congresos', component: CongresosComponent, canActivate: [authGuard] },
      { path: 'salas', component: SalasComponent, canActivate: [authGuard] },
      { path: 'presentaciones', component: PresentacionesComponent, canActivate: [authGuard] },
    ]
  },
  { path: 'landing', component: LandingComponent },
  //registro exposicion por congreso
  { path: 'registro-exposicion/:id', component: RegistroExposicionComponent},
  { path: '**', redirectTo: '/' }, // Redirige a '/' si no hay coincidencia
];
