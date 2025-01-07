import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ExposureService} from '../../services/exposure.service';
import {academicDegrees, ExposureInsertItem, researchLines} from '../../interfaces/entities';
import {ActivatedRoute} from '@angular/router';
import {routes} from '../../app.routes';
import {NgSelectComponent} from '@ng-select/ng-select';


@Component({
  selector: 'app-registro-exposicion',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectComponent
  ],
  templateUrl: './registro-exposicion.component.html',
  styleUrl: './registro-exposicion.component.css'
})
export class RegistroExposicionComponent {

  protected readonly researchLines = researchLines;

  exposureInsertItem: ExposureInsertItem = this.initializeExposureInsertItem();

  constructor(private exposureService: ExposureService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.exposureInsertItem.CongressGuid = params['id'];
    })
  }

  onSubmit(){
    this.exposureService.createExposure(this.exposureInsertItem).subscribe(
      res => {
        this.exposureInsertItem = this.initializeExposureInsertItem();
      }
    )
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.exposureInsertItem.pdfFile = file;
    } else {
      alert('Por favor, selecciona un archivo PDF válido.');
    }
  }

  addAuthor() {
    if (this.exposureInsertItem.Authors.length < 3) {
      this.exposureInsertItem.Authors.push({
        AcademicDegree: -1,
        City: '',
        Country: '',
        IDNumber: '',
        InstitutionalMail: '',
        Name: '',
        PersonalMail: '',
        PhoneNumber: '',
        Position: 0
      });
    }
  }

  private initializeExposureInsertItem(): ExposureInsertItem {
    return {Authors: [{
        Position: 0,
        Name: '',
        IDNumber: '',
        InstitutionalMail: '',
        PersonalMail: '',
        PhoneNumber: '',
        Country: '',
        City: '',
        AcademicDegree: null
      }], CongressGuid: '', ResearchLine: null, pdfFile: null, Name:""};
  }

  protected readonly academicDegrees = academicDegrees;
}
