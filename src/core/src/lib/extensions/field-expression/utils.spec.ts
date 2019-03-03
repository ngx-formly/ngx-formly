import { evalExpression, removeFieldControl, addFieldControl } from './utils';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('evalExpression', () => {
  it('should evaluate the value correctly', () => {
    let expression = () => { return this.model.val; };
    this.model = {
      val: 2,
    };
    expect(evalExpression(expression, this, [this.model])).toBe(2);
  });
});

describe('removeFieldControl', () => {
  it('FormArray', () => {
    const field = { key: '0', formControl: new FormControl() };
    const parent = new FormArray([new FormControl(), field.formControl]);

    removeFieldControl(parent, field);
    expect(field.formControl.parent).toBeNull();
    expect(parent.controls.length).toBe(1);
    expect(parent.controls[0]).not.toEqual(field.formControl);
  });

  it('FormGroup', () => {
    const field = { key: '0', formControl: new FormControl() };
    const parent = new FormGroup({ '0': field.formControl });

    removeFieldControl(parent, field);
    expect(parent.get('0')).toBeNull();
    expect(field.formControl.parent).toBeNull();
  });

  it('FormGroup with nested field key', () => {
    const field = { key: 'test.0', formControl: new FormControl() };
    const parent = new FormGroup({ '0': field.formControl });

    removeFieldControl(parent, field);
    expect(parent.get('0')).toBeNull();
    expect(field.formControl.parent).toBeNull();
  });
});

describe('addFieldControl', () => {
  it('FormArray', () => {
    const field = { key: '0', formControl: new FormControl(), parent: { model: {} } };
    const parent = new FormArray([new FormControl()]);

    addFieldControl(parent, field);
    expect(field.formControl.parent).not.toBeNull();
    expect(parent.controls.length).toEqual(2);
    expect(parent.controls[0]).toEqual(field.formControl);
  });

  it('FormGroup', () => {
    const field = { key: '0', formControl: new FormControl(), parent: { model: {} } };
    const parent = new FormGroup({});

    addFieldControl(parent, field);
    expect(parent.get('0')).toEqual(field.formControl);
    expect(field.formControl.parent).not.toBeNull();
  });

  it('FormGroup with nested field key', () => {
    const field = { key: 'test.0', formControl: new FormControl(), parent: { model: {} } };
    const parent = new FormGroup({});

    addFieldControl(parent, field);
    expect(parent.get('0')).toEqual(field.formControl);
    expect(field.formControl.parent).not.toBeNull();
  });

  it('should take account of  model changes', () => {
    const field = { key: '0', formControl: new FormControl(), parent: { model: { '0': 'test' } } };
    const parent = new FormGroup({});

    addFieldControl(parent, field);
    expect(field.formControl.value).toEqual('test');
  });
});
