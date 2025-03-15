import {Component, OnInit} from '@angular/core';
import {ApiResponse} from '../../interfaces/api-response';
import {AttendanceItem, CongressItem} from '../../interfaces/entities';
import {AttendancesService} from '../../services/attendances.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CongressService } from '../../services/congress.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    NgbPagination,
    NgSelectComponent,
  ],
  templateUrl: './asistencias.component.html',
  styleUrl: './asistencias.component.css'
})
export class AsistenciasComponent implements OnInit {

  searchTerm: string = '';
  response: ApiResponse<AttendanceItem> | null = null;

  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  congressIdFilter: number | null = null;
  congresses: CongressItem[] = [];

  constructor(
    private attendanceService: AttendancesService,
    private congressService: CongressService,
  ) {
  }

  ngOnInit(): void {
    this.loadAttendances();
    this.loadFilterCongress({target: {value: ''}});
  }

  loadAttendances(){
    this.attendanceService.getAttendances(this.currentPage,this.pageSize,this.searchTerm, Number(this.congressIdFilter)).subscribe({
      next: response => {
        this.response = {
          ...response,
          items: response.items.map((item: AttendanceItem) => ({
            ...item,
            date: this.formatDate(item.date),
          }))
        };
      }
    })
  }

  onSearchChange() {
    this.currentPage = 1; // Reiniciar a la primera página
    this.loadAttendances();
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadAttendances();
  }

  formatDate(isoDate: string): string {
    return isoDate.split('T')[0];
  }

  loadFilterCongress(event: any) {
    let searchTerm = event.target.value;
    this.congressService.getCongresses(1, 15, searchTerm).subscribe({
      next: (response) => {
        this.congresses = response.items;
      }
    })
  }

  downloadReport() {
    this.attendanceService.downloadReport(this.currentPage, this.pageSize, this.searchTerm, Number(this.congressIdFilter)).subscribe({
      next: (response: any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'Reporte.xlsx'; // Valor por defecto

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
      },
      error: (err) => {
        console.error('Error downloading the file:', err);
      }
    });
  }

}
