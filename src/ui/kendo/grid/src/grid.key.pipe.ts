import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gridKey',
  pure: false,
})
export class GridKeyPipe implements PipeTransform {
  transform(value: string | number | (string | number)[]): string {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value.toString();
  }
}
