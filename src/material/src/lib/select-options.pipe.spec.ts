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

  it('group options', () => {
    const options = [
      { label: '1', value: '1', parent: '1' },
      { label: '2', value: '2', parent: '1' },
      { label: '3', value: '3', parent: '2' },
    ];

    pipe.transform(options, 'parent').subscribe((options) => {
      expect(options).toEqual([
        {
          label: '1',
          group: [
            { label: '1', value: '1', parent: '1' },
            { label: '2', value: '2', parent: '1' },
          ],
        },
        {
          label: '2',
          group: [
            { label: '3', value: '3', parent: '2' },
          ],
        },
      ]);
    });
  });
});
