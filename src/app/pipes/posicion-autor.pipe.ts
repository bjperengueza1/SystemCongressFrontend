import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'posicionAutor',
  standalone: true
})
export class PosicionAutorPipe implements PipeTransform {

  transform(value: number | null): string {
    if (value == 0) {
      return 'Primer autor';
    }
    if (value == 1) {
      return 'Segundo autor';
    }
    if (value == 2) {
      return 'Tercer autor';
    }
    return "";
  }

}
