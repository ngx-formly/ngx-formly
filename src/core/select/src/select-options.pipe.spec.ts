import { FormlySelectOptionsPipe } from './select-options.pipe';
import { of as observableOf } from 'rxjs';

describe('Pipe: FormlySelectOptionsPipe', () => {
  let pipe: FormlySelectOptionsPipe;

  beforeEach(() => {
    pipe = new FormlySelectOptionsPipe();
  });

  it('passing options as an array', () => {
    pipe.transform([{ label: '1', value: '1' }]).subscribe((options) => {
      expect(options).toEqual([{ label: '1', value: '1' }]);
    });
  });

  it('passing options as an observable', () => {
    pipe.transform(observableOf([{ label: '1', value: '1' }])).subscribe((options) => {
      expect(options).toEqual([{ label: '1', value: '1' }]);
    });
  });

  describe('label & value props', () => {
    let options;
    beforeEach(() => {
      options = [{ name: 'foo', id: '1' }];
    });

    it('as a string', () => {
      const field = {
        templateOptions: {
          labelProp: 'name',
          valueProp: 'id',
        },
      };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([{ label: 'foo', value: '1' }]);
      });
    });

    it('with group props', () => {
      options = [
        { name: '1', id: '1', parent: '1' },
        { name: '2', id: '2', parent: '1' },
        { name: '3', id: '3', parent: '2' },
      ];

      const field = {
        templateOptions: {
          labelProp: item => item.name,
          valueProp: item => item.id,
          groupProp: item => item.parent,
        },
      };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([
          {
            label: '1',
            group: [
              { label: '1', value: '1' },
              { label: '2', value: '2' },
            ],
          },
          {
            label: '2',
            group: [
              { label: '3', value: '3' },
            ],
          },
        ]);
      });
    });

    it('as a function', () => {
      const field = {
          templateOptions: {
            labelProp: item => item.name,
            valueProp: item => item.id,
          },
        };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([{ label: 'foo', value: '1' }]);
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
              { label: '1', value: '1' },
              { label: '2', value: '2' },
            ],
          },
          {
            label: '2',
            group: [
              { label: '3', value: '3' },
            ],
          },
        ]);
      });
    });

    it('as a function', () => {
      const field = { templateOptions: { groupProp: item => item.parent } };

      pipe.transform(options, field).subscribe((options) => {
        expect(options).toEqual([
          {
            label: '1',
            group: [
              { label: '1', value: '1' },
              { label: '2', value: '2' },
            ],
          },
          {
            label: '2',
            group: [
              { label: '3', value: '3' },
            ],
          },
        ]);
      });
    });
  });
});
