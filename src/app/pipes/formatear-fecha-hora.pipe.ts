import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFechaHora',
  standalone: true
})
export class FormatearFechaHoraPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value || value === '0001-01-01T00:00:00') {
      return '';
    }
    return new Date(value).toLocaleString()
  }

}
