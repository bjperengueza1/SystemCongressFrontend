import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obtenerHoraFormateada',
  standalone: true
})
export class ObtenerHoraFormateadaPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) {
      return '';
    }
    return value.split('T')[1];
  }

}
