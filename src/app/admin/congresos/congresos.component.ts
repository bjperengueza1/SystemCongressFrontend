import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {CongressService,ApiResponse} from '../../services/congress.service';

interface Congreso {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
}

@Component({
  selector: 'app-congresos',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe,
    NgbPagination
  ],
  templateUrl: './congresos.component.html',
  styleUrl: './congresos.component.css'
})
export class CongresosComponent implements OnInit {
  congresses: ApiResponse | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 10; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  congresos: Congreso[] = [];
  selectedCongreso: Congreso = this.initializeCongreso();

  constructor(
    private modalService: NgbModal,
    private congressService: CongressService
  ) {}

  ngOnInit() {
    this.loadCongresses(this.currentPage,10);
  }

  // Cargar todos los congresos desde el servicio
  loadCongresses(page: number, size: number) {
    this.congressService.getCongresses(page, size).subscribe({
      next: (response) => (this.congresses = response),
      error: (err) => console.error('Error al cargar congresos', err),
    });
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadCongresses(this.currentPage, this.pageSize);
  }


  // Método para inicializar un objeto Congreso vacío
  // Inicializar un congreso vacío
  private initializeCongreso(): Congreso {
    return { id: 0, nombre: '', fechaInicio: '', fechaFin: '', ubicacion: '' };
  }

  open(content: any) {
    this.selectedCongreso = this.initializeCongreso(); // Reiniciar para nuevo congreso
    this.modalService.open(content);
  }

  // Abrir modal para editar un congreso
  edit(content: any, congreso: Congreso) {
    this.selectedCongreso = { ...congreso }; // Clonar el objeto seleccionado
    this.modalService.open(content);
  }

  save() {
    if (this.selectedCongreso.id) {
      // Editar congreso
      this.congressService.updateCongress(this.selectedCongreso).subscribe({
        next: () => {
          //this.loadCongresses(); // Recargar la lista
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Error al actualizar congreso', err),
      });
    } else {
      // Crear nuevo congreso
      this.congressService.createCongress(this.selectedCongreso).subscribe({
        next: () => {
          //this.loadCongresses(); // Recargar la lista
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Error al crear congreso', err),
      });
    }
  }

  delete(congreso: Congreso) {
    const confirmDelete = confirm(
      `¿Estás seguro de eliminar el congreso "${congreso.nombre}"?`
    );
    if (confirmDelete) {
      this.congressService.deleteCongress(congreso.id).subscribe({
        //next: () => this.loadCongresses(), // Recargar la lista después de eliminar
        error: (err) => console.error('Error al eliminar congreso', err),
      });
    }
  }
}
