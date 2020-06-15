import { FormlySelectOptionsPipe } from './select-options.pipe';
import { of as observableOf } from 'rxjs';

describe('Pipe: FormlySelectOptionsPipe', () => {
  let pipe: FormlySelectOptionsPipe;

  beforeEach(() => {
    pipe = new FormlySelectOptionsPipe();
  });

  it('passing options as an array', () => {
    pipe.transform([{ label: '1', value: '1' }]).subscribe((options) => {
      expect(options).toEqual([{ label: '1', value: '1', disabled: false }]);
    });
  });

  it('passing options as an observable', () => {
    pipe.transform(observableOf([{ label: '1', value: '1' }])).subscribe((options) => {
      expect(options).toEqual([{ label: '1', value: '1', disabled: false }]);
    });
  });

  it('should add a flag for flat options', () => {
    const field: any = { templateOptions: {} };
    pipe.transform([{ label: '1', value: '1' }], field).subscribe((options) => {
      expect(field.templateOptions._flatOptions).toEqual(true);
    });

    pipe.transform([{ label: '1', value: '1', group: '1' }], field).subscribe((options) => {
      expect(field.templateOptions._flatOptions).toEqual(false);
    });
  });

  it('already grouped structure, so nothing to process', () => {
    const field = {};
    const options = [
      {
        label: 'g1',
        group: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
        ],
      },
      {
        label: 'g2',
        group: [{ label: '3', value: '3' }],
      },
    ];

    pipe.transform(options, field).subscribe((options) => {
      expect(options).toEqual([
        {
          label: 'g1',
          group: [
            { label: '1', value: '1', disabled: false },
            { label: '2', value: '2', disabled: false },
          ],
        },
        {
          label: 'g2',
          group: [{ label: '3', value: '3', disabled: false }],
        },
      ]);
    });
  });

  describe('label & value & disabled props', () => {
    let options;
    beforeEach(() => {
      options = [{ name: 'foo', id: '1', locked: true }];
    });

    it('as a string', () => {
      const field = {
        templateOptions: {
          labelProp: 'name',
          valueProp: 'id',
          disabledProp: 'locked',
        },
      };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([{ label: 'foo', value: '1', disabled: true }]);
      });
    });

    it('as a function', () => {
      const field = {
        templateOptions: {
          labelProp: (item) => item.name,
          valueProp: (item) => item.id,
          disabledProp: (item) => item.locked,
        },
      };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([{ label: 'foo', value: '1', disabled: true }]);
      });
    });

    it('with group props', () => {
      options = [
        { name: '1', id: '1', locked: true, parent: '1' },
        { name: '2', id: '2', locked: false, parent: '1' },
        { name: '3', id: '3', locked: false, parent: '2' },
      ];

      const field = {
        templateOptions: {
          labelProp: (item) => item.name,
          valueProp: (item) => item.id,
          disabledProp: (item) => item.locked,
          groupProp: (item) => item.parent,
        },
      };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([
          {
            label: '1',
            group: [
              { label: '1', value: '1', disabled: true },
              { label: '2', value: '2', disabled: false },
            ],
          },
          {
            label: '2',
            group: [{ label: '3', value: '3', disabled: false }],
          },
        ]);
      });
    });
  });

  describe('group options', () => {
    let options;
    beforeEach(() => {
      options = [
        { label: '1', value: '1', parent: '1' },
        { label: '2', value: '2', parent: '1' },
        { label: '3', value: '3', parent: '2' },
      ];
    });

    it('as a string', () => {
      const field = { templateOptions: { groupProp: 'parent' } };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([
          {
            label: '1',
            group: [
              { label: '1', value: '1', disabled: false },
              { label: '2', value: '2', disabled: false },
            ],
          },
          {
            label: '2',
            group: [{ label: '3', value: '3', disabled: false }],
          },
        ]);
      });
    });

    it('as a function', () => {
      const field = { templateOptions: { groupProp: (item) => item.parent } };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([
          {
            label: '1',
            group: [
              { label: '1', value: '1', disabled: false },
              { label: '2', value: '2', disabled: false },
            ],
          },
          {
            label: '2',
            group: [{ label: '3', value: '3', disabled: false }],
          },
        ]);
      });
    });
  });
});
