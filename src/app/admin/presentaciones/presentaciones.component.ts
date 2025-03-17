import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {DOCUMENT, NgForOf, NgIf} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ApiResponse} from '../../interfaces/api-response';
import {
  academicDegrees,
  ApproveExposureModel,
  AuthorItem,
  CongressItem,
  EditExposurePendingModel,
  ExposureItem, RejectExposureModel,
  researchLines, RoomsItem,
  statusExposure
} from '../../interfaces/entities';
import {ExposureService} from '../../services/exposure.service';
import {saveAs} from 'file-saver';
import {Clipboard} from '@angular/cdk/clipboard';
import {FormatearFechaPipe} from '../../pipes/formatear-fecha.pipe';
import {NgSelectComponent} from '@ng-select/ng-select';
import {CongressService} from '../../services/congress.service';
import {AlertService} from '../../services/alert.service';
import {TipoExposicionPipe} from '../../pipes/tipo-exposicion.pipe';
import { PosicionAutorPipe } from "../../pipes/posicion-autor.pipe";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-presentaciones',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgbPagination,
    FormatearFechaPipe,
    NgSelectComponent,
    TipoExposicionPipe
],
  templateUrl: './presentaciones.component.html',
  styleUrl: './presentaciones.component.css'
})
export class PresentacionesComponent implements OnInit {
  
  private domain = '';

  searchTerm: string = '';

  response: ApiResponse<ExposureItem>  | null = null;
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizes = [5, 10, 15, 20];

  authors: AuthorItem[] = [];

  approveExposureModel:ApproveExposureModel = this.initializeApproveExposure();

  rejectExposureModel:RejectExposureModel = {exposureId : 0, observation : ""};

  editExposurePendingModel: EditExposurePendingModel = {exposureId: 0, name: '', researchLine: 0, observation: '', urlAccess: ''};

  roomsItems: RoomsItem[] = [];

  congressIdFilter: number | null = null;
  congresses: CongressItem[] = [];
  researchLinesFilter = researchLines;
  researchLineFilter: number | null = null;
  typesFilter = [
    { value: 1, label: 'Ponencia' },
    { value: 2, label: 'Conferencia' }
  ];
  typeFilter: number | null = null;

  constructor(
    private modalService: NgbModal,
    private exposureService: ExposureService,
    private congressService: CongressService,
    private alertService: AlertService,
    protected clipboard: Clipboard,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.loadExposures(this.currentPage, this.pageSize, this.searchTerm);
    this.loadFilterCongress({target: {value: ''}});
    this.domain = this.document.location.origin;
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

  loadFilterCongress(event: any) {
    let searchTerm = event.target.value;
    this.congressService.getCongresses(1, 15, searchTerm).subscribe({
      next: (response) => {
        this.congresses = response.items;
      }
    })
  }

  loadExposures2() {
    this.exposureService.getExposures2(1, this.pageSize, this.searchTerm, Number(this.congressIdFilter), Number(this.researchLineFilter), Number(this.typeFilter)).subscribe({
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
      academicDegreeLabel: this.getAcademicDegree(item.academicDegree)
    }))
    this.modalService.open(content,{size:'xl'});
  }

  approve(form: NgForm) {
    if(!form.valid) {
      return
    }
    this.exposureService.approveExposure(this.approveExposureModel.exposureId,this.approveExposureModel).subscribe({
      next: (response) => {
        this.loadExposures(1, this.pageSize, this.searchTerm);
        this.modalService.dismissAll();
        this.alertService.showSuccess("Exitoso","Aprobado exitosamente");
      },
      error: (err) => {
        this.alertService.showValidationErrors(err.error.errors);
      }
    });
  }

  openApproveExposure(content:any, exposure: ExposureItem) {
    this.approveExposureModel = this.initializeApproveExposure();
    this.congressService.getRoomsByCongress(exposure.congressId, 1, 100).subscribe({
      next: (response) => {
        this.roomsItems = response.items;
        this.approveExposureModel.congressId = exposure.congressId;
        this.approveExposureModel.exposureId = exposure.exposureId;
        this.modalService.open(content);
      }
    })
  }

  openOnReviewExposure(exposure: ExposureItem) {
    this.rejectExposureModel = {exposureId: exposure.exposureId ,observation : ""};
    Swal.fire({
      title: '¿Está seguro de enviar a revisión?',
      text: "¡No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar a revisión'
    }).then((result) => {
      if (result.isConfirmed) {
        this.exposureService.onReviewExposure(exposure.exposureId).subscribe({
          next: (response) => {
            this.loadExposures(1, this.pageSize, this.searchTerm);
            this.alertService.showSuccess("Exitoso","Enviado a revisión exitosamente");
          }
        })
      }
    }
    )
  }

  openEditExposure(content:any, exposure: ExposureItem) {
    this.editExposurePendingModel = {exposureId: exposure.exposureId, name: exposure.name, researchLine: exposure.researchLine, observation: exposure.observation, urlAccess: exposure.urlAccess};
    this.modalService.open(content);
  }

  editExposure(form: NgForm) {
    if(!form.valid) {
      return;
    }
    this.exposureService.editExposure(this.editExposurePendingModel.exposureId, this.editExposurePendingModel).subscribe({
      next: (response) => {
        this.loadExposures(1, this.pageSize, this.searchTerm);
        this.modalService.dismissAll();
        this.alertService.showSuccess("Exitoso","Editado exitosamente");
      },
      error: (err) => {
        this.alertService.showError("Error",err.error);
      }
    })
  }

  openRejectExposure(content:any,exposure: ExposureItem) {
    this.rejectExposureModel = {exposureId: exposure.exposureId ,observation : ""};
    this.modalService.open(content);
  }

  reject(form: NgForm) {
    if(!form.valid) {
      return;
    }
    this.exposureService.rejectExposure(this.rejectExposureModel.exposureId,this.rejectExposureModel ).subscribe({
      next: (response) => {
        this.loadExposures(1, this.pageSize, this.searchTerm);
        this.modalService.dismissAll();
        this.alertService.showSuccess("Exitoso","Rechazado exitosamente");
      }
    })
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

  copyUrlRegisterAtendance(guid: string): void {
    this.clipboard.copy(`${this.domain}/registro-asistencia/${guid}`);
  }

  initializeApproveExposure():ApproveExposureModel  {
    return {roomId: null, exposureId: 0,congressId: 0,dateEnd: '', dateStart: '', observation: '', urlAccess: ''};
  }

  downloadReport() {
    this.exposureService.downloadReport(1, this.pageSize, this.searchTerm, Number(this.congressIdFilter),Number(this.researchLineFilter),Number(this.typeFilter)).subscribe({
      next: (response: any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'Reporte.xlsx'; // Valor por defecto

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

  changePresented(event: any, exposureId: number) {
    this.exposureService.changePresented(exposureId, event.target.checked == true ? "SI":"NO").subscribe({
      next: (response) => {
        this.loadExposures(1, this.pageSize, this.searchTerm);
        this.alertService.showSuccess("Exitoso","Cambiado exitosamente");
      }
    })
  }

  formatDate(isoDate: string): string {
    return isoDate.split('T')[0];
  }


}
