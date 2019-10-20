import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      selectOptionsData: {
        teams: [
          { id: '1', name: 'Bayern Munich', sportId: '1' },
          { id: '2', name: 'Real Madrid', sportId: '1' },
          { id: '3', name: 'Cleveland', sportId: '2' },
          { id: '4', name: 'Miami', sportId: '2' },
        ],
        players: [
          { id: '1', name: 'Bayern Munich (Player 1)', teamId: '1' },
          { id: '2', name: 'Bayern Munich (Player 2)', teamId: '1' },
          { id: '3', name: 'Real Madrid (Player 1)', teamId: '2' },
          { id: '4', name: 'Real Madrid (Player 2)', teamId: '2' },
          { id: '5', name: 'Cleveland (Player 1)', teamId: '3' },
          { id: '6', name: 'Cleveland (Player 2)', teamId: '3' },
          { id: '7', name: 'Miami (Player 1)', teamId: '4' },
          { id: '8', name: 'Miami (Player 2)', teamId: '4' },
        ],
      },
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'sport',
      type: 'select',
      templateOptions: {
        label: 'Sport',
        options: [{ id: '1', name: 'Soccer' }, { id: '2', name: 'Basketball' }],
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
      expressionProperties: {
        'templateOptions.options': 'formState.selectOptionsData.teams.filter(team => team.sportId === model.sport)',
        // reset model when updating select options
        'model.team': `field.templateOptions.options.find(o => o.id === model.team) ? model.team:null`,
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
      expressionProperties: {
        'templateOptions.options': 'formState.selectOptionsData.players.filter(player => player.teamId === model.team)',
        // reset model when updating select options
        'model.player': `field.templateOptions.options.find(o => o.id === model.player) ? model.player:null`,
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
