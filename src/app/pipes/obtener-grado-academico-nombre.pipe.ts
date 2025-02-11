import { Pipe, PipeTransform } from '@angular/core';
import {academicDegrees} from '../interfaces/entities';

@Pipe({
  name: 'obtenerGradoAcademicoNombre',
  standalone: true
})
export class ObtenerGradoAcademicoNombrePipe implements PipeTransform {

  transform(value: number): string {
    return academicDegrees[value].label;
  }

}
