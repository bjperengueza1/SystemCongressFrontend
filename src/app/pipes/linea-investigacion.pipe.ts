import { Pipe, PipeTransform } from '@angular/core';
import {academicDegrees, researchLines} from '../interfaces/entities';

@Pipe({
  name: 'lineaInvestigacion',
  standalone: true
})
export class LineaInvestigacionPipe implements PipeTransform {

  transform(value: number): string {
    return researchLines[value].label;
  }

}
