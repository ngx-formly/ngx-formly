import { FormlySelectOptionsPipe } from './select-options.pipe';
import { firstValueFrom, isObservable, Observable, of as observableOf, Subject } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFormOptionsCache, FormlyValueChangeEvent } from 'src/core/src/lib/models';
import { createBuilder } from '@ngx-formly/core/testing';

describe('Pipe: FormlySelectOptionsPipe', () => {
  let pipe: FormlySelectOptionsPipe;

  beforeEach(() => {
    pipe = new FormlySelectOptionsPipe();
  });

  it('passing empty options', () => {
    pipe.transform(undefined).subscribe((options) => {
      expect(options).toEqual([]);
    });
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

  it('passing options as an observable that is not an Observable instance', async () => {
    const source = observableOf([{ label: '1', value: '1' }]);
    const crossInstanceObservable = {
      lift: source.lift.bind(source),
      pipe: source.pipe.bind(source),
      subscribe: source.subscribe.bind(source),
    };

    expect(crossInstanceObservable instanceof Observable).toBe(false);
    expect(isObservable(crossInstanceObservable)).toBe(true);

    await expect(firstValueFrom(pipe.transform(crossInstanceObservable))).resolves.toEqual([
      { label: '1', value: '1', disabled: false },
    ]);
  });

  it('should detect field expressions changes', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const field: FormlyFieldConfig = {
      options: { fieldChanges },
      props: {
        options: [{ label: '1', value: '1' }],
      },
    };

    const spy = vi.fn();
    pipe.transform([], field).subscribe(spy);
    fieldChanges.next({ value: [], field, type: 'expressionChanges', property: 'props.options' });
    fieldChanges.next({ value: [], field, type: 'expressionChanges', property: 'templateOptions.options' });
    fieldChanges.next({ value: [], field, type: 'expressionChanges', property: 'test' });
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('keeps the supplied options when the field has a longer list', () => {
    const options = [
      { label: 'Visible', value: 1 },
      { label: 'Excluded', value: 2 },
    ];
    const field: FormlyFieldConfig = { key: 'item', props: { options } };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    pipe.transform(options.slice(0, 1), field).subscribe(next);

    field.options.build();
    expect(next).toHaveBeenLastCalledWith([{ label: 'Visible', value: 1, disabled: false }]);
    pipe.ngOnDestroy();
  });

  it('returns the custom mapper result when the source replaces an option with equal data', () => {
    let options = [{ label: 'Choice', value: 1 }];
    const field: FormlyFieldConfig = {
      key: 'item',
      props: { mapProp: (option) => option },
      expressions: { 'props.options': () => options },
    };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    pipe.transform(field.props.options, field).subscribe(next);
    expect(next.mock.lastCall[0][0]).toBe(options[0]);

    options = [{ label: 'Choice', value: 1 }];
    field.options.build();
    expect(next.mock.lastCall[0][0]).toBe(options[0]);
    pipe.ngOnDestroy();
  });

  it('preserves the selected object reference when a rebuild replaces it with an equal value', () => {
    const options = [{ label: 'Choice', value: { id: 1 } }];
    const field: FormlyFieldConfig = { key: 'item', props: { options } };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    pipe.transform(options, field).subscribe(next);
    const previous = next.mock.lastCall[0][0];

    options[0].value = { id: 1 };
    field.options.build();
    const current = next.mock.lastCall[0][0];
    expect(current.value).toBe(options[0].value);
    expect(current).not.toBe(previous);
    pipe.ngOnDestroy();
  });

  it.each(['properties', 'mapProp'])('should refresh contextual %s after rebuilding unchanged options', (mapping) => {
    const options = [{}];
    let label = 'Before';
    let group = 'First group';
    let value = 1;
    let disabled = false;
    const field: FormlyFieldConfig = {
      key: 'item',
      props:
        mapping === 'properties'
          ? {
              labelProp: () => label,
              groupProp: () => group,
              valueProp: () => value,
              disabledProp: () => disabled,
            }
          : { mapProp: () => ({ label: group, group: [{ label, value, disabled }] }) },
      expressions: { 'props.options': () => options },
    };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    pipe.transform(field.props.options, field).subscribe(next);
    expect(next).toHaveBeenLastCalledWith([
      { label: 'First group', group: [{ label: 'Before', value: 1, disabled: false }] },
    ]);

    label = 'After';
    group = 'Second group';
    value = 2;
    disabled = true;
    next.mockClear();
    field.options.build();
    expect(next).toHaveBeenCalledExactlyOnceWith([
      { label: 'Second group', group: [{ label: 'After', value: 2, disabled: true }] },
    ]);
    pipe.ngOnDestroy();
  });

  it('should release rebuild callbacks when changing fields, switching to a stream, or destroying the pipe', () => {
    const first: FormlyFieldConfig = { key: 'first', props: { options: [{ label: 'First', value: 1 }] } };
    const second: FormlyFieldConfig = { key: 'second', props: { options: [{ label: 'Second', value: 2 }] } };
    createBuilder().build({ fieldGroup: [first] });
    createBuilder().build({ fieldGroup: [second] });
    const firstNext = vi.fn();
    const secondNext = vi.fn();
    const complete = vi.fn();
    pipe.transform(first.props.options, first).subscribe({ next: firstNext, complete });
    pipe.transform(second.props.options, second).subscribe(secondNext);
    expect(complete).toHaveBeenCalledOnce();
    firstNext.mockClear();
    secondNext.mockClear();

    first.options.build();
    expect(firstNext).not.toHaveBeenCalled();
    expect(secondNext).not.toHaveBeenCalled();
    second.options.build();
    expect(secondNext).toHaveBeenCalledOnce();

    secondNext.mockClear();
    const streamNext = vi.fn();
    pipe.transform(observableOf([{ label: 'Stream', value: 3 }]), second).subscribe(streamNext);
    second.options.build();
    expect(secondNext).not.toHaveBeenCalled();
    expect(streamNext).toHaveBeenCalledExactlyOnceWith([{ label: 'Stream', value: 3, disabled: false }]);

    pipe.transform(second.props.options, second).subscribe(secondNext);
    secondNext.mockClear();
    pipe.ngOnDestroy();
    second.options.build();
    expect(secondNext).not.toHaveBeenCalled();
    expect((first.options as FormlyFormOptionsCache)._afterBuild.size).toBe(0);
    expect((second.options as FormlyFormOptionsCache)._afterBuild.size).toBe(0);
  });

  it('should not fail on a rebuild when mapProp returns a non-object', () => {
    const field: FormlyFieldConfig = {
      key: 'item',
      props: { options: [{ label: 'A', value: 1 }], mapProp: () => undefined },
    };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    const error = vi.fn();
    pipe.transform(field.props.options, field).subscribe({ next, error });

    expect(() => field.options.build()).not.toThrow();
    expect(error).not.toHaveBeenCalled();
    pipe.ngOnDestroy();
  });

  it('should keep the identity of unchanged static options after a rebuild', () => {
    const field: FormlyFieldConfig = {
      key: 'item',
      props: {
        options: [
          { label: 'A', value: 1 },
          { label: 'B', value: 2 },
        ],
      },
    };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    pipe.transform(field.props.options, field).subscribe(next);
    const [first] = next.mock.lastCall[0];

    field.options.build();
    const latest = next.mock.lastCall[0];
    expect(latest[0]).toBe(first);

    (field.props.options as { label: string }[])[1].label = 'Changed';
    field.options.build();
    expect(next.mock.lastCall[0][0]).toBe(first);
    expect(next.mock.lastCall[0][1]).toEqual({ label: 'Changed', value: 2, disabled: false });
    pipe.ngOnDestroy();
  });

  it('T4: should keep emitting options derived from the transform argument after a rebuild', () => {
    const field: FormlyFieldConfig = {
      key: 'item',
      props: {
        options: [
          { label: 'A', value: 1 },
          { label: 'B', value: 2 },
        ],
      },
    };
    createBuilder().build({ fieldGroup: [field] });
    const derived = (field.props.options as { label: string; value: number }[]).filter(({ value }) => value === 2);
    const next = vi.fn();
    pipe.transform(derived, field).subscribe(next);
    expect(next).toHaveBeenLastCalledWith([{ label: 'B', value: 2, disabled: false }]);

    field.options.build();
    expect(next).toHaveBeenLastCalledWith([{ label: 'B', value: 2, disabled: false }]);
    pipe.ngOnDestroy();
  });

  it('should refresh after partial builds and wait for failed builds to recover', () => {
    let fail = false;
    let label = 'Before';
    const field: FormlyFieldConfig = {
      key: 'item',
      props: { options: [{}], labelProp: () => label },
      expressions: {
        'props.description': () => {
          if (fail) {
            throw new Error('Invalid expression');
          }
          return '';
        },
      },
    };
    createBuilder().build({ fieldGroup: [field] });
    const next = vi.fn();
    pipe.transform(field.props.options, field).subscribe(next);

    label = 'Partial';
    next.mockClear();
    field.options.build(field);
    expect(next).toHaveBeenCalledExactlyOnceWith([{ label: 'Partial', value: undefined, disabled: false }]);

    label = 'Recovered';
    fail = true;
    next.mockClear();
    expect(() => field.options.build()).toThrow('Invalid expression');
    expect(next).not.toHaveBeenCalled();
    fail = false;
    field.options.build();
    expect(next).toHaveBeenCalledExactlyOnceWith([{ label: 'Recovered', value: undefined, disabled: false }]);
    pipe.ngOnDestroy();
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
    let options: { name: string; id: string; locked: boolean; parent?: string }[];
    beforeEach(() => {
      options = [{ name: 'foo', id: '1', locked: true }];
    });

    it('as a string', () => {
      const field = {
        props: {
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
        props: {
          labelProp: (item: (typeof options)[number]) => item.name,
          valueProp: (item: (typeof options)[number]) => item.id,
          disabledProp: (item: (typeof options)[number]) => item.locked,
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
        props: {
          labelProp: (item: (typeof options)[number]) => item.name,
          valueProp: (item: (typeof options)[number]) => item.id,
          disabledProp: (item: (typeof options)[number]) => item.locked,
          groupProp: (item: (typeof options)[number]) => item.parent,
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
    let options: { label: string; value: string; parent: string }[];
    beforeEach(() => {
      options = [
        { label: '1', value: '1', parent: '1' },
        { label: '2', value: '2', parent: '1' },
        { label: '3', value: '3', parent: '2' },
      ];
    });

    it('as a string', () => {
      const field = { props: { groupProp: 'parent' } };

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
      const field = { props: { groupProp: (item: FormlyFieldConfig) => item.parent } };

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
