import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoExposicion',
  standalone: true
})
export class TipoExposicionPipe implements PipeTransform {

  transform(value: number): string {
    return value == 1 ? 'Ponencia' : 'Conferencia';
  }

}
