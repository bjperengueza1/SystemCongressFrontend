import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {ApiResponse} from '../../interfaces/api-response';
import {CongressItem, RoomsItem} from '../../interfaces/entities';

@Component({
  selector: 'app-congresos',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgbPagination
  ],
  templateUrl: './congresos.component.html',
  styleUrl: './congresos.component.css'
})
export class CongresosComponent implements OnInit {
  response: ApiResponse<CongressItem> | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  results: ApiResponse<RoomsItem> | null = null;
  currentPageResults = 1; // Página actual, para manejar la paginación
  pageSizeResults = 5; // Tamaño de página predeterminado

  //congresos: CongressItem[] = [];
  selectedCongreso: CongressItem = this.initializeCongreso();

  constructor(
    private modalService: NgbModal,
    private congressService: CongressService
  ) {}

  ngOnInit() {
    this.loadCongresses(this.currentPage,this.pageSize);
  }

  // Cargar todos los congresos desde el servicio
  loadCongresses(page: number, size: number) {
    this.congressService.getCongresses(page, size).subscribe({
      next: (response) => {
        this.response = {
          ...response,
          items: response.items.map((item: CongressItem) => ({
            ...item,
            startDate: this.formatDate(item.startDate),
            endDate: this.formatDate(item.endDate),
          })),
        };
      },
      error: (err) => console.error('Error al cargar congresos', err),
    });
  }

  loadRooms(page: number, size: number) {

    this.congressService.getRoomsByCongress(this.selectedCongreso.congressId,page,size).subscribe(
      {
        next: (response) =>{
          this.results = response;
        }
      }
    )
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadCongresses(this.currentPage, this.pageSize);
  }


  // Método para inicializar un objeto Congreso vacío
  // Inicializar un congreso vacío
  private initializeCongreso(): CongressItem {
    //return { id: 0, nombre: '', fechaInicio: '', fechaFin: '', ubicacion: '' };
    return {congressId: 0, endDate: '', location: '', name: '', startDate: ''}
  }

  open(content: any) {
    this.selectedCongreso = this.initializeCongreso(); // Reiniciar para nuevo congreso
    this.modalService.open(content);
  }

  // Abrir modal para editar un congreso
  edit(content: any, congressItem: CongressItem) {
    this.selectedCongreso = { ...congressItem }; // Clonar el objeto seleccionado
    this.modalService.open(content);
  }

  save() {
    if (this.selectedCongreso.congressId) {
      // Editar congreso
      this.congressService.updateCongress(this.selectedCongreso).subscribe({
        next: () => {
          //actualizar el response
          this.loadCongresses(this.currentPage, this.pageSize); // Recargar la lista
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Error al actualizar congreso', err),
      });
    } else {
      // Crear nuevo congreso
      this.congressService.createCongress(this.selectedCongreso).subscribe({
        next: () => {
          //this.loadCongresses(this.currentPage, this.pageSize); // Recargar la lista
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Error al crear congreso', err),
      });
    }
    //this.loadCongresses(1, this.pageSize);
    //this.currentPage = 1;
  }

  delete(congressItem: CongressItem) {
    const confirmDelete = confirm(
      `¿Estás seguro de eliminar el congreso "${congressItem.name}"?`
    );
    if (confirmDelete) {
      this.congressService.deleteCongress(congressItem.congressId).subscribe({
        //next: () => this.loadCongresses(), // Recargar la lista después de eliminar
        error: (err) => console.error('Error al eliminar congreso', err),
      });
    }
  }

  formatDate(isoDate: string): string {
    return isoDate.split('T')[0];
  }

  openListRoomsPage(content: any, congressItem: CongressItem) {
    this.selectedCongreso = { ...congressItem };
    this.currentPageResults = 1;
    this.congressService.getRoomsByCongress(congressItem.congressId,this.currentPageResults,this.pageSizeResults).subscribe(
      {
        next: (response) =>{
          this.results = response;
          this.modalService.open(content);
        }
      }
    )
  }
}
