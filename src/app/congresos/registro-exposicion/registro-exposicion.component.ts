import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ExposureService} from '../../services/exposure.service';
import {academicDegrees, CongressItem, ExposureInsertItem, researchLines} from '../../interfaces/entities';
import {ActivatedRoute, Router} from '@angular/router';
import {NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf} from '@angular/common';
import {CongressService} from '../../services/congress.service';
import {AlertService} from '../../services/alert.service';
import {FormatearFechaPipe} from '../../pipes/formatear-fecha.pipe';


@Component({
  selector: 'app-registro-exposicion',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectComponent,
    NgForOf,
    FormatearFechaPipe,
  ],
  templateUrl: './registro-exposicion.component.html',
  styleUrl: './registro-exposicion.component.css'
})
export class RegistroExposicionComponent implements OnInit {

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
  ) { }

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
    console.log(this.exposureInsertItem);
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
    if (file && (file.type === 'application/pdf' || file.type === 'application/x-pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      this.exposureInsertItem.pdfFile = file;
      this.fileValid = true;
    } else {
      this.fileValid = false;
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

  removeAuthor(index: number) {
    if (this.exposureInsertItem.Authors.length > 1) { // Asegura que al menos quede un autor
      this.exposureInsertItem.Authors.splice(index, 1); // Elimina el autor en la posición `index`
    } else {
      // Muestra un mensaje de error si intentas eliminar el último autor
      this.alertService.showError("Error", "Debe haber al menos un autor.");
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
      }], CongressGuid: congressGuid, ResearchLine: null, Type: 1, pdfFile: null, Name:""};
  }

  countries = [
    { value: 'Afganistán' },
    { value: 'Albania' },
    { value: 'Alemania' },
    { value: 'Andorra' },
    { value: 'Angola' },
    { value: 'Antigua y Barbuda' },
    { value: 'Arabia Saudita' },
    { value: 'Argelia' },
    { value: 'Argentina' },
    { value: 'Armenia' },
    { value: 'Australia' },
    { value: 'Austria' },
    { value: 'Azerbaiyán' },
    { value: 'Bahamas' },
    { value: 'Bangladés' },
    { value: 'Barbados' },
    { value: 'Baréin' },
    { value: 'Bélgica' },
    { value: 'Belice' },
    { value: 'Benín' },
    { value: 'Bielorrusia' },
    { value: 'Birmania' },
    { value: 'Bolivia' },
    { value: 'Bosnia y Herzegovina' },
    { value: 'Botsuana' },
    { value: 'Brasil' },
    { value: 'Brunéi' },
    { value: 'Bulgaria' },
    { value: 'Burkina Faso' },
    { value: 'Burundi' },
    { value: 'Bután' },
    { value: 'Cabo Verde' },
    { value: 'Camboya' },
    { value: 'Camerún' },
    { value: 'Canadá' },
    { value: 'Catar' },
    { value: 'Chad' },
    { value: 'Chile' },
    { value: 'China' },
    { value: 'Chipre' },
    { value: 'Colombia' },
    { value: 'Comoras' },
    { value: 'Corea del Norte' },
    { value: 'Corea del Sur' },
    { value: 'Costa de Marfil' },
    { value: 'Costa Rica' },
    { value: 'Croacia' },
    { value: 'Cuba' },
    { value: 'Dinamarca' },
    { value: 'Dominica' },
    { value: 'Ecuador' },
    { value: 'Egipto' },
    { value: 'El Salvador' },
    { value: 'Emiratos Árabes Unidos' },
    { value: 'Eritrea' },
    { value: 'Eslovaquia' },
    { value: 'Eslovenia' },
    { value: 'España' },
    { value: 'Estados Unidos' },
    { value: 'Estonia' },
    { value: 'Esuatini' },
    { value: 'Etiopía' },
    { value: 'Filipinas' },
    { value: 'Finlandia' },
    { value: 'Fiyi' },
    { value: 'Francia' },
    { value: 'Gabón' },
    { value: 'Gambia' },
    { value: 'Georgia' },
    { value: 'Ghana' },
    { value: 'Granada' },
    { value: 'Grecia' },
    { value: 'Guatemala' },
    { value: 'Guinea' },
    { value: 'Guinea Ecuatorial' },
    { value: 'Guinea-Bisáu' },
    { value: 'Guyana' },
    { value: 'Haití' },
    { value: 'Honduras' },
    { value: 'Hungría' },
    { value: 'India' },
    { value: 'Indonesia' },
    { value: 'Irak' },
    { value: 'Irán' },
    { value: 'Irlanda' },
    { value: 'Islandia' },
    { value: 'Islas Marshall' },
    { value: 'Islas Salomón' },
    { value: 'Israel' },
    { value: 'Italia' },
    { value: 'Jamaica' },
    { value: 'Japón' },
    { value: 'Jordania' },
    { value: 'Kazajistán' },
    { value: 'Kenia' },
    { value: 'Kirguistán' },
    { value: 'Kiribati' },
    { value: 'Kuwait' },
    { value: 'Laos' },
    { value: 'Lesoto' },
    { value: 'Letonia' },
    { value: 'Líbano' },
    { value: 'Liberia' },
    { value: 'Libia' },
    { value: 'Liechtenstein' },
    { value: 'Lituania' },
    { value: 'Luxemburgo' },
    { value: 'Macedonia del Norte' },
    { value: 'Madagascar' },
    { value: 'Malasia' },
    { value: 'Malaui' },
    { value: 'Maldivas' },
    { value: 'Malí' },
    { value: 'Malta' },
    { value: 'Marruecos' },
    { value: 'Mauricio' },
    { value: 'Mauritania' },
    { value: 'México' },
    { value: 'Micronesia' },
    { value: 'Moldavia' },
    { value: 'Mónaco' },
    { value: 'Mongolia' },
    { value: 'Montenegro' },
    { value: 'Mozambique' },
    { value: 'Namibia' },
    { value: 'Nauru' },
    { value: 'Nepal' },
    { value: 'Nicaragua' },
    { value: 'Níger' },
    { value: 'Nigeria' },
    { value: 'Noruega' },
    { value: 'Nueva Zelanda' },
    { value: 'Omán' },
    { value: 'Países Bajos' },
    { value: 'Pakistán' },
    { value: 'Palaos' },
    { value: 'Panamá' },
    { value: 'Papúa Nueva Guinea' },
    { value: 'Paraguay' },
    { value: 'Perú' },
    { value: 'Polonia' },
    { value: 'Portugal' },
    { value: 'Reino Unido' },
    { value: 'República Centroafricana' },
    { value: 'República Checa' },
    { value: 'República Democrática del Congo' },
    { value: 'República Dominicana' },
    { value: 'Ruanda' },
    { value: 'Rumanía' },
    { value: 'Rusia' },
    { value: 'Samoa' },
    { value: 'San Cristóbal y Nieves' },
    { value: 'San Marino' },
    { value: 'San Vicente y las Granadinas' },
    { value: 'Santa Lucía' },
    { value: 'Santo Tomé y Príncipe' },
    { value: 'Senegal' },
    { value: 'Serbia' },
    { value: 'Seychelles' },
    { value: 'Sierra Leona' },
    { value: 'Singapur' },
    { value: 'Siria' },
    { value: 'Somalia' },
    { value: 'Sri Lanka' },
    { value: 'Sudáfrica' },
    { value: 'Sudán' },
    { value: 'Sudán del Sur' },
    { value: 'Suecia' },
    { value: 'Suiza' },
    { value: 'Surinam' },
    { value: 'Tailandia' },
    { value: 'Taiwán' },
    { value: 'Tanzania' },
    { value: 'Tayikistán' },
    { value: 'Timor Oriental' },
    { value: 'Togo' },
    { value: 'Tonga' },
    { value: 'Trinidad y Tobago' },
    { value: 'Túnez' },
    { value: 'Turkmenistán' },
    { value: 'Turquía' },
    { value: 'Tuvalu' },
    { value: 'Ucrania' },
    { value: 'Uganda' },
    { value: 'Uruguay' },
    { value: 'Uzbekistán' },
    { value: 'Vanuatu' },
    { value: 'Vaticano' },
    { value: 'Venezuela' },
    { value: 'Vietnam' },
    { value: 'Yemen' },
    { value: 'Yibuti' },
    { value: 'Zambia' },
    { value: 'Zimbabue' }
  ];
}
