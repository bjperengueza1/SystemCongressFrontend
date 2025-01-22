import {Component, OnInit} from '@angular/core';
import {ApiResponse} from '../../interfaces/api-response';
import {AttendeeItem} from '../../interfaces/entities';
import {AttendeeService} from '../../services/attendee.service';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-asistentes',
  standalone: true,
  imports: [
    NgbPagination,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './asistentes.component.html',
  styleUrl: './asistentes.component.css'
})
export class AsistentesComponent implements OnInit {

  searchTerm: string = '';
  response: ApiResponse<AttendeeItem> | null = null;

  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  constructor(private attendeeService: AttendeeService) {
  }

  ngOnInit(): void {
    this.loadAttendees(this.currentPage, this.pageSize, this.searchTerm);
  }

  loadAttendees(page: number, size: number, searchTerm: string) {
    this.attendeeService.getAttendees(page, size, searchTerm).subscribe({
      next: result => {
        this.response = result
      }
    })
  }

  onSearchChange() {
    this.currentPage = 1; // Reiniciar a la primera página
    this.loadAttendees(this.currentPage, this.pageSize, this.searchTerm);
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadAttendees(this.currentPage, this.pageSize, this.searchTerm);
  }
}
