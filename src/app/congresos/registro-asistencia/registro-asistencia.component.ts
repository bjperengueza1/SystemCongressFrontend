import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ExposureService} from '../../services/exposure.service';
import {ActivatedRoute, Router} from '@angular/router';
import swal from'sweetalert2';

import {
  academicDegrees,
  AttendanceInsertItem,
  AuthorItem, CongressItem,
  ExposureItem,
  researchLines
} from '../../interfaces/entities';
import {AttendancesService} from '../../services/attendances.service';




@Component({
  selector: 'app-registro-asistencia',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgSelectComponent,
  ],
  templateUrl: './registro-asistencia.component.html',
  styleUrl: './registro-asistencia.component.css'
})
export class RegistroAsistenciaComponent implements OnInit {
  // Datos simulados de la exposición
  exposure: ExposureItem | null = null;

  attendance: AttendanceInsertItem = this.initializeAttendance();

  private exposureGuid: string = '';
  idNumber: any;

  constructor(
    private exposureService: ExposureService,
    private attendanceService: AttendancesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.exposureGuid = params['id'];
    })
  }

  ngOnInit(): void {
    this.exposureService.getExposure(this.exposureGuid).subscribe({
      next: data => {
        this.exposure = {
          ...data,
          researchLineLabel: this.getResearchLine(data.researchLine),
          authors: data.authors.map((author: AuthorItem) => ({
            ...author,
            academicDegreeLabel: this.getAcademicDegree(author.academicDegree)
          }))
        };
        this.attendance.exposureId = data.exposureId;
      }
    })
  }

  private initializeAttendance(): AttendanceInsertItem {
    return {attendee: {
        attendeeId: 0,
        name: '',
        email: '',
        phone: '',
        institution: '',
        idNumber: ''
      }, exposureId: 0}
  }

  registerAttendance(): void {
    this.attendanceService.createAttendance(this.attendance).subscribe({
      next: (response) => {
        // Manejo de respuesta exitosa (2xx)
        swal.fire({
          title: "Excelente!",
          text: "Asistencia registrada exitosamente!",
          icon: "success",

        }).then(result => {
          this.router.navigate(['/landing']);
        });

      },
      error: (error) => {
        // Manejo de errores (4xx o 5xx) obtener el mensaje
        swal.fire({
          title: "Error!",
          text: error.error.mensaje,
          icon: "error"
        });

        if (error.status >= 400 && error.status < 500) {
          console.error('Ocurrió un error al registrar la asistencia. Verifique los datos.');
        } else if (error.status >= 500) {
          console.error('Error del servidor. Inténtelo de nuevo más tarde.');
        } else {
          console.error('Error desconocido.');
        }
      }
    });
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
