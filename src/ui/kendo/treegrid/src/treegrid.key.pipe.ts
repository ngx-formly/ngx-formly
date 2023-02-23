import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'treegridKey',
  pure: false,
})
export class TreeGridKeyPipe implements PipeTransform {
  transform(value: string | number | (string | number)[]): string {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value.toString();
  }
}
