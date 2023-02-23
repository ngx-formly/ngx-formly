import { Pipe, PipeTransform } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({
  name: 'gridDisplay',
  pure: false,
})
export class GridDisplayPipe implements PipeTransform {
  transform(value: any, field: FormlyFieldConfig): string {
    const exp: string | string[] = field?.props?.displayExpression;
    if (exp) {
      if (Array.isArray(exp)) {
        let temp: any = value;
        let achou = true;
        exp.map((v: string) => {
          if (Object.keys(temp).indexOf(v) !== -1) {
            temp = temp[v];
          } else {
            achou = false;
          }
        });

        if (achou) {
          return temp as string;
        }
        return '';
      } else {
        return value[exp];
      }
    }
    return '';
  }
}
