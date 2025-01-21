import {Component, OnInit} from '@angular/core';
import {ApiResponse} from '../../interfaces/api-response';
import {AttendanceItem} from '../../interfaces/entities';
import {AttendancesService} from '../../services/attendances.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    NgbPagination
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

  constructor(
    private attendanceService: AttendancesService
  ) {
  }

  ngOnInit(): void {
    this.loadAttendances(this.currentPage, this.pageSize, this.searchTerm);
  }

  loadAttendances(page: number, size: number, searchTerm: string){
    this.attendanceService.getAttendances(this.currentPage,this.pageSize,this.searchTerm).subscribe({
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
    this.loadAttendances(this.currentPage, this.pageSize, this.searchTerm);
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadAttendances(this.currentPage, this.pageSize, this.searchTerm);
  }

  formatDate(isoDate: string): string {
    return isoDate.split('T')[0];
  }




}
