import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ApiResponse} from '../../interfaces/api-response';
import {CertificateAttendanceDto} from '../../interfaces/entities';
import {CongressService} from '../../services/congress.service';
import {FormatearFechaPipe} from '../../pipes/formatear-fecha.pipe';

@Component({
  selector: 'app-certificates-attendee',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgbPagination,
    FormatearFechaPipe
  ],
  templateUrl: './certificates-attendee.component.html',
  styleUrl: './certificates-attendee.component.css'
})
export class CertificatesAttendeeComponent implements OnInit {

  response: ApiResponse<CertificateAttendanceDto> | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página
  searchTerm: string = '';

  constructor(
    private congressService: CongressService,
  ){}

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(){
    this.congressService.getCertificatesAttendances(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.response = response;
      }
    })
  }

  //onSearchChange(){}

  //onPageSizeChange(event: Event){}

}
