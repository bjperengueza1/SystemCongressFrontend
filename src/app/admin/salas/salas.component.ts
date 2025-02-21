import {Component, OnInit} from '@angular/core';
import {CongressItem, RoomWitchCongressItem} from '../../interfaces/entities';
import {ApiResponse} from '../../interfaces/api-response';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {RoomsService} from '../../services/rooms.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap} from 'rxjs';
import {CongressService} from '../../services/congress.service';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    NgbPagination,
    NgSelectComponent
  ],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})
export class SalasComponent implements OnInit{
  searchTerm: string = '';
  response: ApiResponse<RoomWitchCongressItem> | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  selectedRoomWitchCongres: RoomWitchCongressItem = this.initializeRoom();

  congresses: CongressItem[] = [];

  searchCongresses$ = new Subject<string>(); // Observable para manejar el input

  constructor(
    private modalService: NgbModal,
    private roomService: RoomsService,
    private congressService: CongressService) {}

  ngOnInit(): void {
    this.loadRooms(this.currentPage,this.pageSize, this.searchTerm);

    this.searchCongresses$
      .pipe(
        debounceTime(300), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged(), // Evitar búsquedas repetidas con el mismo término
        switchMap((term) =>
          term ? this.congressService.searchCongresses(term) : of([])
        ), // Llama a la API
        catchError(() => of([])) // Manejar errores devolviendo un array vacío
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.congresses = response
        }
      );
  }

  loadRooms(page: number, pageSize: number, search: string): void {
    this.roomService.getRooms(page, pageSize, search).subscribe({
      next: (response: ApiResponse<RoomWitchCongressItem>) => {
        this.response = response;
      }
    })
  }

  onSearchChange() {
    this.currentPage = 1; // Reiniciar a la primera página
    this.loadRooms(this.currentPage, this.pageSize, this.searchTerm);
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadRooms(this.currentPage, this.pageSize, this.searchTerm);
  }

  private initializeRoom(): RoomWitchCongressItem {
    return {capacity: 0, congressId: 0, congressName: '', location: '', name: '', roomId: 0}
  }

  open(content:any){
    this.selectedRoomWitchCongres = this.initializeRoom();
    this.modalService.open(content);
  }

  edit(content: any, roomWitchCongressItem: RoomWitchCongressItem): void {
    this.selectedRoomWitchCongres = {...roomWitchCongressItem};
    this.congresses = [{
      congressId: roomWitchCongressItem.congressId,
      name: roomWitchCongressItem.congressName,
      startDate: '',
      endDate: '',
      location: '',
      minHours: 0,
      guid: '',
      status: 0,
      fileFlayer: '',
      fileCertificateConference: '',
      fileCertificateAttendance: '',
      fileCertificateExposure: ''
    }];
      this.modalService.open(content);

  }

  save(){
    if (this.selectedRoomWitchCongres.roomId) {
      //Editar sala
      this.roomService.updateRoom(this.selectedRoomWitchCongres).subscribe({
        next: () => {
          this.currentPage = 1;
          this.loadRooms(this.currentPage, this.pageSize, this.searchTerm);
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Error al actualizar sala', err),
      })
    } else {
      this.roomService.createRoom(this.selectedRoomWitchCongres).subscribe({
        next: () => {
          this.currentPage = 1;
          this.loadRooms(this.currentPage, this.pageSize, this.searchTerm);
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Error al crear sala', err),
      })
    }
  }

  onSearchCongresses(term: { term: string; items: any[] }): void {
    this.searchCongresses$.next(term.term); // Emite el término de búsqueda
  }
}
