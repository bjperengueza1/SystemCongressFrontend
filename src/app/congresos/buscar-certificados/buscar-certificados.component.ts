import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {ListCongressCertificate} from '../../interfaces/entities';
import {saveAs} from 'file-saver';
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
    this.congressService.downloadCertificateAttendance(congressId,this.cedula).subscribe({
      next: (response:any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = "certificado.pdf"; // Valor por defecto

        // Extraer el nombre del archivo del header Content-Disposition
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="(.+)"/);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }
        // Crear un blob y usar file-saver para descargar
        const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
        saveAs(blob, fileName);
      }
    })
  }
}
