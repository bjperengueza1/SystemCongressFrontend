import {Component, OnInit} from '@angular/core';
import {CongressItem, RoomWitchCongressItem} from '../../interfaces/entities';
import {ApiResponse} from '../../interfaces/api-response';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {RoomsService} from '../../services/rooms.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    NgbPagination
  ],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})
export class SalasComponent implements OnInit{

  response: ApiResponse<RoomWitchCongressItem> | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  selectedRoomWitchCongres: RoomWitchCongressItem = this.initializeRoom();

  constructor(
    private modalService: NgbModal,
    private roomService: RoomsService) {}

  ngOnInit(): void {
    this.loadRooms(this.currentPage,this.pageSize);
  }

  loadRooms(page: number, pageSize: number): void {
    this.roomService.getRooms(page, pageSize).subscribe({
      next: (response: ApiResponse<RoomWitchCongressItem>) => {
        this.response = response;
      }
    })
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadRooms(this.currentPage, this.pageSize);
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
    this.modalService.open(content);
  }

  save(){

  }

}
