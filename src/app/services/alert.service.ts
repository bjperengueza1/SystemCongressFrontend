import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  }

  showError(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
    });
  }

  showValidationErrors(errors: string[]) {
    Swal.fire({
      icon: 'error',
      title: 'Errores de validación',
      html: `<ul>${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
    });
  }

  showWarning(title: string, text: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
    });
  }
}
