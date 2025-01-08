import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ExposureService} from '../../services/exposure.service';
import {academicDegrees, ExposureInsertItem, researchLines} from '../../interfaces/entities';
import {ActivatedRoute} from '@angular/router';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DOCUMENT} from '@angular/common';


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
  protected readonly academicDegrees = academicDegrees;

  exposureInsertItem: ExposureInsertItem = this.initializeExposureInsertItem();
  private domain = "";
  private congressGuid: string = '';

  constructor(private exposureService: ExposureService,
              private route: ActivatedRoute,
              ) {
    this.route.params.subscribe(params => {
      this.congressGuid = params['id'];
      this.exposureInsertItem.CongressGuid = this.congressGuid;
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
        Position: this.exposureInsertItem.Authors.length +1
      });
    }
  }

  private initializeExposureInsertItem(): ExposureInsertItem {
    console.log(this.congressGuid)
    return {Authors: [{
        Position: 1,
        Name: '',
        IDNumber: '',
        InstitutionalMail: '',
        PersonalMail: '',
        PhoneNumber: '',
        Country: '',
        City: '',
        AcademicDegree: null
      }], CongressGuid: this.congressGuid, ResearchLine: null, pdfFile: null, Name:""};
  }
}
