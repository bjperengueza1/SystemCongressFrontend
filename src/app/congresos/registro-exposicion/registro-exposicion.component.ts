import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ExposureService} from '../../services/exposure.service';


@Component({
  selector: 'app-registro-exposicion',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './registro-exposicion.component.html',
  styleUrl: './registro-exposicion.component.css'
})
export class RegistroExposicionComponent {

  researchLines = [
    { value: -1, label: 'Seleccione...' },
    { value: 0, label: 'Tecnologías de la Información y Comunicación' },
    { value: 1, label: 'Educación Superior y modalidades de estudio' },
    { value: 2, label: 'Administración, Marketing y Emprendimiento' },
    { value: 3, label: 'Calidad e innovación educativa' },
    { value: 4, label: 'Artes y Humanidades' },
    { value: 5, label: 'Actividad física y deportiva' },
    { value: 6, label: 'Servicios de protección, seguridad y transporte' },
    { value: 7, label: 'Ingeniería, Industria y Construcción' }
  ];

  fileToUpload: File | null = null;

  formData = {
    name: '',
    researchLine: this.researchLines[0].value,
    congressGuid: '5d8df8b091554cd5bff69b82dc8ccfdc',
    authors: [{
      Position : 1,
      Name: 'Autor',
      IDNumber: '1234',
      InstitutionalMail: 'autor@autor.com',
      PersonalMail: 'autor@autor.com',
      PhoneNumber: '1234',
      Country: 'Guayaquil',
      City: 'Ecuador'
    }]
  };


  constructor(private exposureService: ExposureService) {
  }

  onSubmit(){
    this.exposureService.createExposure(this.formData,this.fileToUpload).subscribe(
      res => {
        console.log(res);
      }
    )
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.fileToUpload = file;
    } else {
      alert('Por favor, selecciona un archivo PDF válido.');
    }
  }
}
