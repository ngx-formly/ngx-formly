import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  onDestroy$ = new Subject<void>();
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'sport',
      type: 'select',
      templateOptions: {
        label: 'Sport',
        options: [
          { id: '1', name: 'Soccer' },
          { id: '2', name: 'Basketball' },
        ],
        valueProp: 'id',
        labelProp: 'name',
      },
    },
    {
      key: 'team',
      type: 'select',
      templateOptions: {
        label: 'Team',
        options: [],
        valueProp: 'id',
        labelProp: 'name',
      },
      lifecycle: {
        onInit: (form, field) => {
          const teams = [
            { id: '1', name: 'Bayern Munich', sportId: '1' },
            { id: '2', name: 'Real Madrid', sportId: '1' },
            { id: '3', name: 'Cleveland', sportId: '2' },
          ];

          form.get('sport').valueChanges.pipe(
            takeUntil(this.onDestroy$),
            tap(sportId => {
              field.formControl.setValue('');
              field.templateOptions.options = teams.filter(team => team.sportId === sportId);
            }),
          ).subscribe();
        },
      },
    },
    {
      key: 'player',
      type: 'select',
      templateOptions: {
        label: 'Player',
        options: [],
        valueProp: 'id',
        labelProp: 'name',
      },
      lifecycle: {
        onInit: (form, field) => {
          const players = [
            { id: '1', name: 'Bayern Munich (Player 1)', teamId: '1' },
            { id: '2', name: 'Bayern Munich (Player 2)', teamId: '1' },
            { id: '3', name: 'Real Madrid (Player 1)', teamId: '2' },
            { id: '4', name: 'Real Madrid (Player 2)', teamId: '2' },
            { id: '5', name: 'Cleveland (Player 1)', teamId: '3' },
            { id: '6', name: 'Cleveland (Player 2)', teamId: '3' },
          ];

          form.get('team').valueChanges.pipe(
            takeUntil(this.onDestroy$),
            tap(sportId => {
              field.formControl.setValue('');
              field.templateOptions.options = players.filter(team => team.teamId === sportId);
            }),
          ).subscribe();
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }

  ngOnDestroy(): void {
    this.onDestroy$.complete();
  }
}
