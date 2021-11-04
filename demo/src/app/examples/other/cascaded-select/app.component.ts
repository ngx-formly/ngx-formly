import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, startWith, tap } from 'rxjs/operators';

interface Model {
  readonly player: string;
  readonly sport: string;
  readonly team: string;
}

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: Partial<Model> = { sport: '1' };
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
      hooks: {
        onInit: (field) => {
          const teams = [
            { id: '1', name: 'Bayern Munich', sportId: '1' },
            { id: '2', name: 'Real Madrid', sportId: '1' },
            { id: '3', name: 'Cleveland', sportId: '2' },
            { id: '4', name: 'Miami', sportId: '2' },
          ];
          const sportControl = field.parent.get('sport').formControl;
          field.templateOptions.options = sportControl.valueChanges.pipe(
            startWith(sportControl.value),
            map((sportId) => teams.filter((team) => team.sportId === sportId)),
            tap(() => field.formControl.setValue(null)),
          );
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
      hooks: {
        onInit: (field) => {
          const players = [
            { id: '1', name: 'Bayern Munich (Player 1)', teamId: '1' },
            { id: '2', name: 'Bayern Munich (Player 2)', teamId: '1' },
            { id: '3', name: 'Real Madrid (Player 1)', teamId: '2' },
            { id: '4', name: 'Real Madrid (Player 2)', teamId: '2' },
            { id: '5', name: 'Cleveland (Player 1)', teamId: '3' },
            { id: '6', name: 'Cleveland (Player 2)', teamId: '3' },
            { id: '7', name: 'Miami (Player 1)', teamId: '4' },
            { id: '8', name: 'Miami (Player 2)', teamId: '4' },
          ];
          const teamControl = field.parent.get('team').formControl;
          field.templateOptions.options = teamControl.valueChanges.pipe(
            startWith(teamControl.value),
            map((teamId) => players.filter((player) => player.teamId === teamId)),
            tap(() => field.formControl.setValue(null)),
          );
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
