import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFecha',
  standalone: true
})
export class FormatearFechaPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value || value === '0001-01-01T00:00:00') {
      return ''; // Retorna vacío si es la fecha inválida
    }
    return value.split('T')[0]; // Formatea la fecha normal
  }

}
