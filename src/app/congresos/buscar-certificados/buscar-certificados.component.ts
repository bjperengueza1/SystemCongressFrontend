import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {ListCongressCertificate} from '../../interfaces/entities';
import {saveAs} from 'file-saver';
import {FormatearFechaPipe} from '../../pipes/formatear-fecha.pipe';
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
    NgForOf,
    FormatearFechaPipe
  ],
  templateUrl: './buscar-certificados.component.html',
  styleUrl: './buscar-certificados.component.css'
})
export class BuscarCertificadosComponent {

  @Input() cedula: string = '';

  //cedula: string = '';
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
        let fileName = "certificado-asistencia.pdf"; // Valor por defecto

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

  descargarCertificadoExposicion(congressId: number) {
    this.congressService.downloadCertificateExposure(congressId,this.cedula).subscribe({
      next: (response:any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = "certificado-ponencia.pdf"; // Valor por defecto

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

  descargarCertificadoConferencia(congressId: number) {
    this.congressService.downloadCertificateConference(congressId,this.cedula).subscribe({
      next: (response:any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = "certificado-conferencia.pdf"; // Valor por defecto

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
