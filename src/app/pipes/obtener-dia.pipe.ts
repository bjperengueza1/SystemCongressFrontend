import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obtenerDia',
  standalone: true
})
export class ObtenerDiaPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value || value === '0001-01-01T00:00:00') {
      return '0';
    }
    return value.split("-")[2].split("T")[0];
  }

}
