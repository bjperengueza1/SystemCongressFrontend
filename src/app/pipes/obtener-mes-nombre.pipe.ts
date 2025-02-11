import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obtenerMesNombre',
  standalone: true
})
export class ObtenerMesNombrePipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value || value === '0001-01-01T00:00:00') {
      return '0';
    }

    const date = new Date(value);
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const monthIndex = date.getMonth();
    return months[monthIndex];
  }

}
