import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
    sports = [
        { id: '1', name: 'Soccer' },
        { id: '2', name: 'Basketball' },
    ];

    getSports(): Observable<any[]> {
        return of(this.sports);
    }
}
