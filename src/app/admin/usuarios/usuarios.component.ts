import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DOCUMENT, NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {ApiResponse} from '../../interfaces/api-response';
import {CongressItem, RoomsItem, UserItem} from '../../interfaces/entities';
import {Clipboard} from '@angular/cdk/clipboard';
import {AlertService} from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgbPagination
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  searchTerm: string = '';
  response: ApiResponse<UserItem> | null = null;
  currentPage = 1; // Página actual, para manejar la paginación
  pageSize = 5; // Tamaño de página predeterminado
  pageSizes = [5, 10, 15, 20]; // Opciones para el tamaño de página

  idSelected: number = 0;
  modelEditUser: UserItem = {
    userId: 0,
    name: '',
    email: '',
    role: 0,
  }

  modelChangePassword = {
    newPassword: '',
    confirmPassword: ''
  }


  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.loadCongresses(this.currentPage,this.pageSize, this.searchTerm);
  }

  // Cargar todos los congresos desde el servicio
  loadCongresses(page: number, size: number, searchTerm: string) {
    this.authService.getUsers(page, size, searchTerm).subscribe({
      next: (response) => {
        this.response = response;
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

  onPageSizeChange(event: Event): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.loadCongresses(this.currentPage, this.pageSize, this.searchTerm);
  }

  openModalChangePassword(_t46: TemplateRef<any>,idSelected: number) {
    this.idSelected = idSelected;
    this.modalService.open(_t46,{
      centered: true,
      size: "lg"
    });
  }

  changePassword() {
    this.authService.changePasswordByAdmin(this.idSelected, this.modelChangePassword.newPassword, this.modelChangePassword.confirmPassword).subscribe({
      next: () => {
        this.alertService.showSuccess('Exitoso', 'Contraseña cambiada exitosamente.');
        this.modalService.dismissAll();
        this.modelChangePassword.newPassword = '';
        this.modelChangePassword.confirmPassword = '';
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

  // Abrir modal para editar un congreso
  openModalEdit(_t46: TemplateRef<any>, userItem: UserItem) {
    this.idSelected = userItem.userId;
    this.modelEditUser = { ...userItem }; // Clonar el objeto seleccionado
    this.modalService.open(_t46,{
        centered: true,
        size: "lg"
      }
    );
  }

  editUser() {
    this.authService.editUser(this.idSelected, this.modelEditUser.name, this.modelEditUser.email).subscribe({
      next: () => {
        this.alertService.showSuccess('Exitoso', 'Usuario editado exitosamente.');
        this.modalService.dismissAll();
        this.modelEditUser.name = '';
        this.modelEditUser.email = '';
        this.currentPage = 1;
        this.loadCongresses(this.currentPage, this.pageSize, this.searchTerm);
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

  openModalCreate(_t46: TemplateRef<any>) {
    this.modalService.open(_t46,{
        centered: true,
        size: "lg"
      }
    );
  }

  createUser() {
    this.authService.createUser(this.modelEditUser.name, this.modelEditUser.email, this.modelChangePassword.newPassword).subscribe({
      next: () => {
        this.alertService.showSuccess('Exitoso', 'Usuario creado exitosamente.');
        this.modalService.dismissAll();
        this.modelEditUser.name = '';
        this.modelEditUser.email = '';
        this.modelChangePassword.newPassword = '';
        this.modelChangePassword.confirmPassword = '';
        this.currentPage = 1;
        this.loadCongresses(this.currentPage, this.pageSize, this.searchTerm);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          this.alertService.showValidationErrors(err.error.errors)
        } else {
          this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente')
        }
      }
    });
  }

  // Validar el formato del correo
  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

}
