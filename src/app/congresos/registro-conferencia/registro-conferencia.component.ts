import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {academicDegrees, CongressItem, ExposureInsertItem, researchLines} from '../../interfaces/entities';
import {CongressService} from '../../services/congress.service';
import {ExposureService} from '../../services/exposure.service';
import {AlertService} from '../../services/alert.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormatearFechaPipe} from '../../pipes/formatear-fecha.pipe';

@Component({
  selector: 'app-registro-conferencia',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgSelectComponent,
    FormatearFechaPipe
  ],
  templateUrl: './registro-conferencia.component.html',
  styleUrl: './registro-conferencia.component.css'
})
export class RegistroConferenciaComponent implements OnInit {

  protected readonly researchLines = researchLines;
  protected readonly academicDegrees = academicDegrees;

  exposureInsertItem: ExposureInsertItem = {} as ExposureInsertItem;
  congressItem: CongressItem =  {} as CongressItem;

  fileValid: boolean = false;

  constructor(private congressService: CongressService,
              private exposureService: ExposureService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.congressService.getCongressByGuid(params['id']).subscribe({
        next: data => {
          this.congressItem = data;
          this.exposureInsertItem = this.initializeExposureInsertItem(params['id']);
        },
        error: () => {
          this.alertService.showError("Error","No se encontró el congreso")
          this.router.navigate(['/'])
        }
      })
    })
  }

  onSubmit(){
    this.exposureService.createExposure(this.exposureInsertItem).subscribe({
      next: () => {
        this.alertService.showSuccess("Exitoso","Su exposicíón fué registrada con éxtio, espere su correo de confirmacíon sobre su aprobación");
        this.router.navigate(['/'])
      },
      error: err => {
        if (err.status === 400 && err.error.errors) {
          this.alertService.showValidationErrors(err.error.errors)
        } else {
          this.alertService.showError('Error inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente')
        }
      }
    })
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.exposureInsertItem.pdfFile = file;
      this.fileValid = true;
    } else {
      this.fileValid = false;
    }
  }

  addAuthor() {
    if (this.exposureInsertItem.Authors.length < 3) {
      this.exposureInsertItem.Authors.push({
        AcademicDegree: null,
        City: '',
        Country: '',
        IDNumber: '',
        InstitutionalMail: '',
        Name: '',
        PersonalMail: '',
        PhoneNumber: '',
        Position: this.exposureInsertItem.Authors.length +1
      });
    }
  }

  private initializeExposureInsertItem(congressGuid: string): ExposureInsertItem {
    return {Authors: [{
        Position: 1,
        Name: '',
        IDNumber: '',
        InstitutionalMail: '',
        PersonalMail: '',
        PhoneNumber: '',
        Country: null,
        City: '',
        AcademicDegree: null
      }], CongressGuid: congressGuid, ResearchLine: null, Type: 2, pdfFile: null, Name:""};
  }

  countries = [
    { value: 'Argentina' },
    { value: 'Bolivia' },
    { value: 'Brasil' },
    { value: 'Chile' },
    { value: 'Colombia' },
    { value: 'Costa Rica' },
    { value: 'Cuba' },
    { value: 'República Dominicana' },
    { value: 'Ecuador' },
    { value: 'El Salvador' },
    { value: 'Guatemala' },
    { value: 'Honduras' },
    { value: 'México' },
    { value: 'Nicaragua' },
    { value: 'Panamá' },
    { value: 'Paraguay' },
    { value: 'Perú' },
    { value: 'Puerto Rico' },
    { value: 'Uruguay' },
    { value: 'Venezuela' }
  ];
}
