import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ApiResponse} from '../../interfaces/api-response';
import {academicDegrees, AuthorItem, ExposureItem, researchLines, statusExposure} from '../../interfaces/entities';
import {ExposureService} from '../../services/exposure.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-presentaciones',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgbPagination
  ],
  templateUrl: './presentaciones.component.html',
  styleUrl: './presentaciones.component.css'
})
export class PresentacionesComponent implements OnInit {

  searchTerm: string = '';

  response: ApiResponse<ExposureItem>  | null = null;
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizes = [5, 10, 15, 20];

  authors: AuthorItem[] = [];

  constructor(
    private modalService: NgbModal,
    private exposureService: ExposureService
  ) {}

  ngOnInit() {
    this.loadExposures(this.currentPage, this.pageSize, this.searchTerm);
  }

  loadExposures(page: number, pageSize: number, searchTerm: string) {
    this.exposureService.getExposures(page, pageSize, searchTerm).subscribe({
      next: (response) => {
        this.response = {
          ...response,
          items: response.items.map((item: ExposureItem) => ({
            ...item,
            statusLabelExposure: this.getStatusLabel(item.statusExposure),
            researchLineLabel: this.getResearchLine(item.researchLine),
            authors: item.authors.map((author: AuthorItem)=> ({
              ...author,
              academicDegreeLabel: this.getAcademicDegree(author.academicDegree)
            })),
          }))
        }
      }
    })
  }

  onPageSizeChange(event: Event) {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadExposures(this.currentPage, this.pageSize, this.searchTerm);
  }

  onSearchChange() {
    this.currentPage = 1; // Reiniciar a la primera página
    this.loadExposures(this.currentPage, this.pageSize, this.searchTerm);
  }

  open(content: any) {

  }

  openAuthors(content: any) {

  }

  getStatusLabel(value: number): string {
    const status = statusExposure.find(s => s.value === value);
    return status ? status.label : 'Desconocido'; // Manejo de valores no definidos
  }

  getResearchLine(value: number): string {
    const status = researchLines.find(s => s.value === value);
    return status ? status.label : 'Desconocido'; // Manejo de valores no definidos
  }

  getAcademicDegree(value: number): string {
    const status = academicDegrees.find(s => s.value === value);
    return status ? status.label : 'Desconocido'; // Manejo de valores no definidos
  }

  showAuthors(authors: AuthorItem[],content: any ) {
    this.authors = authors.map((item: AuthorItem) => ({
      ...item,
      AcademicDegreeLabel: this.getAcademicDegree(item.academicDegree)
    }))
    this.modalService.open(content,{size:'xl'});
  }

  approve(exposureId: number) {
    this.exposureService.changeStatus(exposureId, 1).subscribe({
      next: (response) => {
        this.loadExposures(1, this.pageSize, this.searchTerm);
      }
    });
  }

  reject(exposureId: number) {
    this.exposureService.changeStatus(exposureId, 2).subscribe({
      next: (response) => {
        this.loadExposures(1, this.pageSize, this.searchTerm);
      }
    });
  }

  downloadSummary(exposureId: number, nameFile: string) {
    this.exposureService.downloadExposure(exposureId).subscribe({
      next: (response: any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = nameFile; // Valor por defecto

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
