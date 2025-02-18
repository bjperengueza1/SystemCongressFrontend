import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DOCUMENT, NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {ApiResponse} from '../../interfaces/api-response';
import {CongressItem, RoomsItem} from '../../interfaces/entities';
import {Clipboard} from '@angular/cdk/clipboard';
import {AlertService} from '../../services/alert.service';

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
  searchTerm: string = '';
  response: ApiResponse<CongressItem> | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  results: ApiResponse<RoomsItem> | null = null;
  currentPageResults = 1; // Página actual, para manejar la paginación
  pageSizeResults = 5; // Tamaño de página predeterminado

  //congresos: CongressItem[] = [];
  selectedCongreso: CongressItem = this.initializeCongreso();

  private domain = '';

  fileValidFlayer: boolean = false;
  fileValidConference: boolean = false;
  fileValidPonencia: boolean = false;
  fileValidAttendance: boolean = false;

  fileFlayer: File | null = null;
  fileConference: File | null = null;
  filePonencia: File | null = null;
  fileAttendance: File | null = null


  constructor(
    private modalService: NgbModal,
    protected clipboard: Clipboard,
    private congressService: CongressService,
    private alertService: AlertService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.loadCongresses(this.currentPage,this.pageSize, this.searchTerm);
    this.domain = this.document.location.origin;
  }

  // Cargar todos los congresos desde el servicio
  loadCongresses(page: number, size: number, searchTerm: string) {
    this.congressService.getCongresses(page, size, searchTerm).subscribe({
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
      error: (err) => {
        this.alertService.showError('Error inesperado','Ocurrió un error inesperado. Por favor, inténtalo nuevamente.');
      },
    });
  }

  onSearchChange() {
    this.currentPage = 1; // Reiniciar a la primera página
    this.loadCongresses(this.currentPage, this.pageSize, this.searchTerm);
  }

  loadRooms(page: number, size: number) {

    this.congressService.getRoomsByCongress(this.selectedCongreso.congressId,page,size).subscribe(
      {
        next: (response) =>{
          this.results = response;
        },
        error: (err) => {

        }
      }
    )
  }

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadCongresses(this.currentPage, this.pageSize, this.searchTerm);
  }


  // Método para inicializar un objeto Congreso vacío
  // Inicializar un congreso vacío
  private initializeCongreso(): CongressItem {
    //return { id: 0, nombre: '', fechaInicio: '', fechaFin: '', ubicacion: '' };
    return {minHours: 0, guid: '', congressId: 0, endDate: '', location: '', name: '', startDate: '', status: 0}
  }

  open(content: any) {
    this.selectedCongreso = this.initializeCongreso(); // Reiniciar para nuevo congreso
    this.modalService.open(content,{
      centered: true,
      size: "lg"
    });
  }

  // Abrir modal para editar un congreso
  edit(content: any, congressItem: CongressItem) {
    this.selectedCongreso = { ...congressItem }; // Clonar el objeto seleccionado
    this.modalService.open(content,
      {
        centered: true,
        size: "lg"
      }
    );
  }

  openModalFile(content: any, congressItem: CongressItem) {
    this.selectedCongreso = { ...congressItem };
    this.modalService.open(content,
      {
        centered: true,
        size: "lg"
      }
    );
  }

  save(congressForm: NgForm) {
    if (!congressForm.valid) {
      return;
    }
    if (this.selectedCongreso.congressId) {
      // Editar congreso
      this.congressService.updateCongress(this.selectedCongreso).subscribe({
        next: () => {
          this.alertService.showSuccess('Congreso', 'El congreso fue actualizado exitosamente.')

          this.currentPage = 1;
          this.loadCongresses(1, this.pageSize, this.searchTerm);
          this.modalService.dismissAll();
        },
        error: (err) => {
          if (err.status === 400 && err.error?.errors) {
            this.alertService.showValidationErrors(err.error.errors)
          } else {
            this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente')
          }
        },
      });
    } else {
      // Crear nuevo congreso
      this.congressService.createCongress(this.selectedCongreso).subscribe({
        next: () => {
          this.alertService.showSuccess('Congreso', 'El congreso fue creado exitosamente.')

          this.currentPage = 1;
          this.loadCongresses(1, this.pageSize, this.searchTerm);
          this.modalService.dismissAll();

        },
        error: (err) => {
          if (err.status === 400 && err.error?.errors) {
            this.alertService.showValidationErrors(err.error.errors)
          } else {
            this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente')
          }
        },
      });
    }
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

  copyUrlRegisterPonencia(guid: string): void {
    this.clipboard.copy(`${this.domain}/registro-ponencia/${guid}`);
  }
  copyUrlRegisterConferencia(guid: string): void {
    this.clipboard.copy(`${this.domain}/registro-conferencia/${guid}`);
  }
  activateCongress(congressId:number){
    this.congressService.activeCongress(congressId).subscribe({
      next: () => {
        this.alertService.showSuccess("Exitoso","Activado exitosamente.");
        this.currentPage = 1;
        this.loadCongresses(1, this.pageSize, this.searchTerm);
      },
      error: (err) => {
        this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente')
      }
    })
  }

  onFileChangeF(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileFlayer = file;
      this.fileValidFlayer = true;
    } else {
      this.fileValidFlayer = false;
    }
  }

  onFileChangeC(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileConference = file;
      this.fileValidConference = true;
    } else {
      this.fileValidConference = false;
    }
  }

  onFileChangeP(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.filePonencia = file;
      this.fileValidPonencia = true;
    } else {
      this.fileValidPonencia = false;
    }
  }

  onFileChangeA(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileAttendance = file;
      this.fileValidAttendance = true;
    } else {
      this.fileValidAttendance = false;
    }
  }

  saveFile(type: number) {
    switch (type) {
      case 1:
        if (!this.fileFlayer) {
          return;
        }
        this.congressService.uploadFlayer(this.selectedCongreso.congressId, this.fileFlayer).subscribe({
          next: () => {
            this.alertService.showSuccess('Exitoso', 'Archivo subido exitosamente.');
            this.modalService.dismissAll();
          },
          error: (err) => {
            this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente');
          },
        });
        break;
      case 2:
        if (!this.fileConference) {
          return;
        }
        this.congressService.uploadConference(this.selectedCongreso.congressId, this.fileConference).subscribe({
          next: () => {
            this.alertService.showSuccess('Exitoso', 'Archivo subido exitosamente.');
            this.modalService.dismissAll();
          },
          error: (err) => {
            this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente');
          },
        });
        break;
      case 3:
        if (!this.filePonencia) {
          return;
        }
        this.congressService.uploadPonencia(this.selectedCongreso.congressId, this.filePonencia).subscribe({
          next: () => {
            this.alertService.showSuccess('Exitoso', 'Archivo subido exitosamente.');
            this.modalService.dismissAll();
          },
          error: (err) => {
            this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente');
          },
        });
        break;
      case 4:
        if (!this.fileAttendance) {
          return;
        }
        this.congressService.uploadAttendance(this.selectedCongreso.congressId, this.fileAttendance).subscribe({
          next: () => {
            this.alertService.showSuccess('Exitoso', 'Archivo subido exitosamente.');
            this.modalService.dismissAll();
          },
          error: (err) => {
            this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente');
          },
        });
        break;
      }
  }


  emails: string[] = []; // Lista de correos
  emailInput: string = ''; // Valor del input
  errorMessage: string = ''; // Mensaje de error

  // Función para agregar un correo
  addEmail() {
    if (this.emailInput && this.validateEmail(this.emailInput)) {
      this.emails.push(this.emailInput);
      this.emailInput = ''; // Limpiar el campo de entrada
      this.errorMessage = ''; // Limpiar el mensaje de error si el correo es válido
    } else {
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
    }
  }

  // Validar el formato del correo
  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  // Función para eliminar un correo de la lista
  removeEmail(index: number) {
    this.emails.splice(index, 1);
  }

  openModalSendInvitationConference(content: any, congressItem: CongressItem) {
    this.selectedCongreso = { ...congressItem };
    this.emails = [];
    this.modalService.open(content,{
      size: "lg"
    });
  }

  // Función para simular el envío de correos
  sendEmails() {
    if (this.emails.length > 0) {

      this.congressService.sendInvitationConference(this.selectedCongreso.congressId, this.emails).subscribe({
        next: () => {
          this.emails = [];
          this.alertService.showSuccess('Exitoso', 'Correos enviados exitosamente.');
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente');
        },
      });
    } else {
      this.errorMessage = 'Por favor, agrega al menos un correo electrónico.';
    }
  }

}
