import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class DataService {
  sports = [
    { id: '1', name: 'Soccer' },
    { id: '2', name: 'Basketball' },
  ];

  getSports() {
    return of(this.sports);
  }
}
