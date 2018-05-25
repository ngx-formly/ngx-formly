import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({ name: 'formlySelectOptions' })
export class FormlySelectOptionsPipe implements PipeTransform {
  transform(options, groupBy = 'group') {
    if (!(options instanceof Observable)) {
      options = observableOf(options);
    }

    return (options as Observable<any>).pipe(
      map(value => this.toOptions(value, groupBy)),
    );
  }

  private toOptions(options, groupBy) {
    const gOptions: any[] = [],
      groups: { [key: string]: any[] } = {};

    options.map((option: any) => {
      if (!option[groupBy]) {
        gOptions.push(option);
      } else {
        if (groups[option[groupBy]]) {
          groups[option[groupBy]].push(option);
        } else {
          groups[option[groupBy]] = [option];
          gOptions.push({
            label: option[groupBy],
            group: groups[option[groupBy]],
          });
        }
      }
    });

    return gOptions;
  }
}
