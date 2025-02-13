import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-congress-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">Crear Nuevo Congreso</h2>
            </div>
            <div class="card-body">
              <form [formGroup]="congressForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre:</label>
                  <input type="text" class="form-control" id="nombre" formControlName="nombre"
                         [class.is-invalid]="congressForm.get('nombre')?.errors?.['required'] && congressForm.get('nombre')?.touched">
                  <div class="invalid-feedback" *ngIf="congressForm.get('nombre')?.errors?.['required'] && congressForm.get('nombre')?.touched">
                    El nombre es requerido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="fechaInicio" class="form-label">Fecha Inicio:</label>
                  <input type="date" class="form-control" id="fechaInicio" formControlName="fechaInicio"
                         [class.is-invalid]="congressForm.get('fechaInicio')?.errors?.['required'] && congressForm.get('fechaInicio')?.touched">
                  <div class="invalid-feedback" *ngIf="congressForm.get('fechaInicio')?.errors?.['required'] && congressForm.get('fechaInicio')?.touched">
                    La fecha de inicio es requerida
                  </div>
                </div>

                <div class="mb-3">
                  <label for="fechaFin" class="form-label">Fecha Fin:</label>
                  <input type="date" class="form-control" id="fechaFin" formControlName="fechaFin"
                         [class.is-invalid]="congressForm.get('fechaFin')?.errors?.['required'] && congressForm.get('fechaFin')?.touched">
                  <div class="invalid-feedback" *ngIf="congressForm.get('fechaFin')?.errors?.['required'] && congressForm.get('fechaFin')?.touched">
                    La fecha de fin es requerida
                  </div>
                </div>

                <div class="mb-3">
                  <label for="ciudad" class="form-label">Ciudad:</label>
                  <input type="text" class="form-control" id="ciudad" formControlName="ciudad"
                         [class.is-invalid]="congressForm.get('ciudad')?.errors?.['required'] && congressForm.get('ciudad')?.touched">
                  <div class="invalid-feedback" *ngIf="congressForm.get('ciudad')?.errors?.['required'] && congressForm.get('ciudad')?.touched">
                    La ciudad es requerida
                  </div>
                </div>

                <div class="mb-3">
                  <label for="flayer" class="form-label">Flayer:</label>
                  <input type="file" class="form-control" id="flayer" (change)="onFileChange($event, 'flayer')" accept="image/*">
                </div>

                <div class="mb-3">
                  <label for="certificadoAsistencia" class="form-label">Plantilla Certificado Asistencia:</label>
                  <input type="file" class="form-control" id="certificadoAsistencia"
                         (change)="onFileChange($event, 'certificadoAsistencia')" accept=".pdf,.doc,.docx">
                </div>

                <div class="mb-3">
                  <label for="certificadoConferencia" class="form-label">Plantilla Certificado Conferencia:</label>
                  <input type="file" class="form-control" id="certificadoConferencia"
                         (change)="onFileChange($event, 'certificadoConferencia')" accept=".pdf,.doc,.docx">
                </div>

                <div class="mb-3">
                  <label for="certificadoPonencia" class="form-label">Plantilla Certificado Ponencia:</label>
                  <input type="file" class="form-control" id="certificadoPonencia"
                         (change)="onFileChange($event, 'certificadoPonencia')" accept=".pdf,.doc,.docx">
                </div>

                <div class="text-end">
                  <button type="submit" class="btn btn-primary" [disabled]="!congressForm.valid">
                    Crear Congreso
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: 'congress-form.component.css'
})
export class CongressFormComponent {
  congressForm: FormGroup;
  files: { [key: string]: File } = {};

  constructor(private fb: FormBuilder) {
    this.congressForm = this.fb.group({
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      ciudad: ['', Validators.required]
    });
  }

  onFileChange(event: any, fileType: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.files[fileType] = file;
    }
  }

  onSubmit() {
    if (this.congressForm.valid) {
      const formData = new FormData();

      // Add form fields
      Object.keys(this.congressForm.value).forEach(key => {
        formData.append(key, this.congressForm.value[key]);
      });

      // Add files
      Object.keys(this.files).forEach(key => {
        formData.append(key, this.files[key]);
      });

      // Here you would typically send the formData to your backend
      console.log('Form Data:', this.congressForm.value);
      console.log('Files:', this.files);
    }
  }
}
