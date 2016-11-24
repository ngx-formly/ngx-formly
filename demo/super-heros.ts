import { Injectable } from '@angular/core';

@Injectable()
export class SuperHerosService {

  public get() {
    return [
      {name: 'Iron Man', value: 'iron_man', gender: 'Male'},
      {name: 'Captain America', value: 'captain_america', gender: 'Male'},
      {name: 'Black Widow', value: 'black_widow', gender: 'Female'},
      {name: 'Hulk', value: 'hulk', gender: 'Male'},
      {name: 'Captain Marvel', value: 'captain_marvel', gender: 'Female'},
    ];
  }
}
