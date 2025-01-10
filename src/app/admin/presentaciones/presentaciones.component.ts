import {Component, NgIterable, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ApiResponse} from '../../interfaces/api-response';
import {academicDegrees, AuthorItem, ExposureItem, researchLines, statusExposure} from '../../interfaces/entities';
import {ExposureService} from '../../services/exposure.service';

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
  content: any;

  constructor(
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

  onPageSizeChange($event: Event) {

  }

  onSearchChange() {

  }

  open(content: any) {

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
}
