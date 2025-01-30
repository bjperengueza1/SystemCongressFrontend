import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {ListCongressCertificate} from '../../interfaces/entities';
interface Certificado {
  tipo: string; // Ejemplo: 'Expositor', 'Participante', 'Oyente'
  descripcion: string; // Información adicional del certificado
}

interface Congreso {
  nombre: string; // Nombre del congreso
  certificados: Certificado[]; // Lista de certificados del congreso
}
@Component({
  selector: 'app-buscar-certificados',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './buscar-certificados.component.html',
  styleUrl: './buscar-certificados.component.css'
})
export class BuscarCertificadosComponent {
  cedula: string = '';
  congresos: { nombre: string; certificados: { tipo: string; descripcion: string }[] }[] = [];
  buscarRealizado: boolean = false;

  congresosCertificados: ListCongressCertificate[] = [];

  constructor(
    private congressService: CongressService,
  ) {}

  buscarCertificados() {
    this.buscarRealizado = true;
    this.congressService.getListCertificates(this.cedula).subscribe({
      next: data => {
        this.congresosCertificados = data;
        console.log(data);
      }
    })
  }

  descargarCertificadoAsistencia(congressId: number) {

  }
}
