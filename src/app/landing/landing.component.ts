import {Component, Inject, OnInit, ViewChild, HostListener} from '@angular/core';
import {NavComponent} from "../components/nav/nav.component";
import {FormsModule} from '@angular/forms';
import {DOCUMENT, NgForOf, NgIf} from '@angular/common';
import {CongressService} from '../services/congress.service';
import {CongressItem, ExposureItem} from '../interfaces/entities';
import {FormatearFechaPipe} from '../pipes/formatear-fecha.pipe';
import {ObtenerDiaPipe} from '../pipes/obtener-dia.pipe';
import {ObtenerAnioPipe} from '../pipes/obtener-anio.pipe';
import {ObtenerMesNombrePipe} from '../pipes/obtener-mes-nombre.pipe';
import {ApiResponse} from '../interfaces/api-response';
import {ExposureService} from '../services/exposure.service';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ObtenerGradoAcademicoNombrePipe} from '../pipes/obtener-grado-academico-nombre.pipe';
import {ObtenerHoraFormateadaPipe} from '../pipes/obtener-hora-formateada.pipe';
import {LineaInvestigacionPipe} from '../pipes/linea-investigacion.pipe';
import {TipoExposicionPipe} from '../pipes/tipo-exposicion.pipe';
import {BuscarCertificadosComponent} from '../congresos/buscar-certificados/buscar-certificados.component';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ObtenerDiaPipe,
    ObtenerAnioPipe,
    ObtenerMesNombrePipe,
    NgbPagination,
    FormatearFechaPipe,
    ObtenerGradoAcademicoNombrePipe,
    ObtenerHoraFormateadaPipe,
    LineaInvestigacionPipe,
    TipoExposicionPipe,
    BuscarCertificadosComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'


})



export class LandingComponent implements OnInit {

  //navegador responsive
  isMenuOpen = false; // Estado del menú

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Alterna el estado
  }


  showButton = false;

  //Boton para subir la pantalla al inicio
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY > 300; // Muestra el botón después de hacer scroll
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @ViewChild(BuscarCertificadosComponent) child!: BuscarCertificadosComponent;

  ponencias: ApiResponse<ExposureItem> | null = null;
  email = 'secretaria@istla.edu.ec'; // Define tu correo aquí
  telefono = '+593 98 384 407'; // Define tu teléfono aquí

  emailInputs: { [key: number]: string } = {};
  submittedConferences: { [key: number]: boolean } = {};
  dniInput: string = '';
  certificateError: string = '';
  certificateSuccess: string = '';
  countdown: CountdownTime = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  message = 'Countdown started';

  increaseDays() {
    this.countdown.days += 1;
  }
  name = '';

  congress : CongressItem = this.initializeCongress();
  canSubmitPonencia: boolean = false;
  canRegisterAttendeePrev: boolean = false;

  counterDays: number = 0;

  currentPage: number = 1;
  pageSize: number = 3;

  urlRegistroPonencia: string = '';

  imageUrl: string = '';


  constructor(
    private congressService: CongressService,
    private exposureService: ExposureService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.congressService.getFlayerActiveCongress().subscribe({
      next: (data: Blob) => {
        this.imageUrl = URL.createObjectURL(data);
      }
    })

    this.congressService.getActiveCongress().subscribe({
      next: data => {
        this.congress = data;
        this.startCountdown();
        this.actualizarDiasEvento();
        let today = new Date();
        today.setHours(0,0,0,0);
        this.canSubmitPonencia = new Date(this.congress.endDateRegistrationExposure) >= today;
        this.canRegisterAttendeePrev = new Date(this.congress.endDateRegistrationAttendee) >= today;
        this.congressService.getExposuresActives(data.congressId, 1, this.pageSize).subscribe({
          next: (data) => {
            console.log(data);
            this.ponencias = data;
          }
        })
        this.urlRegistroPonencia = `${this.document.location.origin}/registro-ponencia/${data.guid}`;
      }
    })

  }

  startCountdown() {
    const congressDate = new Date(this.congress.startDate);

    const updateCountdown = () => {
      const now = new Date();
      const difference = congressDate.getTime() - now.getTime();

      if (difference > 0) {
        this.countdown = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
    };

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  onSubmit(conferenceId: number) {
    console.log('Registro para conferencia:', conferenceId, 'Email:', this.emailInputs[conferenceId]);
    this.exposureService.registerPrevious(conferenceId,this.emailInputs[conferenceId]).subscribe({
      next: data => {
        this.submittedConferences[conferenceId] = true;
        this.emailInputs[conferenceId] = '';
      }
    })
  }

  onCertificateSubmit() {
    console.log('Buscando certificados para DNI:', this.dniInput);

    this.child.buscarCertificados();

    /*if (this.dniInput === '12345678') {
      this.certificateSuccess = 'Certificados encontrados. Iniciando descarga...';
      this.certificateError = '';
    } else {
      this.certificateError = 'No se encontraron certificados para el DNI proporcionado.';
      this.certificateSuccess = '';
    }

    this.dniInput = '';*/
  }

  private initializeCongress(): CongressItem {
    return {
      fileCertificateAttendance: "",
      fileCertificateConference: "",
      fileCertificateExposure: "",
      fileFlayer: "",
      minHours: 0, guid: '', congressId: 0, endDate: '', endDateRegistrationExposure: '',
      endDateNotificationApprove: '',
      endDateRegistrationAttendee: '', location: '', name: '', startDate: '', status: 0}
  }

  private actualizarDiasEvento() {
    let fechaInicio = new Date(this.congress.startDate);
    let fechaFin  = new Date(this.congress.endDate);
    let contadorDias = 0;

    // Aseguramos que fechaInicio sea la más antigua
    if (fechaInicio > fechaFin) {
      const temp = fechaInicio;
      fechaInicio = fechaFin;
      fechaFin = temp;
    }

    // Iteramos por todos los días entre las dos fechas
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      // Si el día no es sábado (6) ni domingo (0), lo contamos
      if (fecha.getDay() !== 0 && fecha.getDay() !== 6) {
        contadorDias++;
      }
    }

    this.counterDays =  contadorDias;
  }

  loadExposures(page: number, pageSize: number) {
    this.congressService.getExposuresActives(this.congress.congressId, page, pageSize).subscribe({
      next: (response) => {
        this.ponencias = response;
      }
    })
  }

}
