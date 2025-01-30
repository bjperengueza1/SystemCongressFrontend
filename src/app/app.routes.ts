import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {AdminComponent} from './admin/admin.component';
import {CongresosComponent} from './admin/congresos/congresos.component';
import {SalasComponent} from './admin/salas/salas.component';
import {LoginComponent} from './admin/login/login.component';
import {authGuard} from './guards/auth.guard';
import {RegistroExposicionComponent} from './congresos/registro-exposicion/registro-exposicion.component';
import {PresentacionesComponent} from './admin/presentaciones/presentaciones.component';
import {RegistroAsistenciaComponent} from './congresos/registro-asistencia/registro-asistencia.component';
import {AsistenciasComponent} from './admin/asistencias/asistencias.component';
import {AsistentesComponent} from './admin/asistentes/asistentes.component';
import {BuscarCertificadosComponent} from './congresos/buscar-certificados/buscar-certificados.component';

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
      { path: 'asistentes', component: AsistentesComponent, canActivate: [authGuard] },
      { path: 'asistencias', component: AsistenciasComponent, canActivate: [authGuard] },
    ]
  },
  { path: 'landing', component: LandingComponent },
  //registro exposicion por congreso
  { path: 'registro-exposicion/:id', component: RegistroExposicionComponent},
  { path: 'registro-asistencia/:id', component: RegistroAsistenciaComponent},
  { path: 'buscar-certificados', component: BuscarCertificadosComponent},
  { path: '**', redirectTo: '/' }, // Redirige a '/' si no hay coincidencia
];
