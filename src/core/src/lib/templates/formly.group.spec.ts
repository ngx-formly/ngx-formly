import { createFormlyFieldComponent as renderComponent } from '@ngx-formly/core/testing';
import { ComponentFixture } from '@angular/core/testing';

function getFormlyGroupField(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('formly-group');
}

function getFormlyGroupFields(fixture: ComponentFixture<any>): HTMLInputElement[] {
  return fixture.nativeElement.querySelectorAll('formly-group > formly-field');
}

describe('Group Field Type', () => {
  it('should render fieldGroup', () => {
    const fixture = renderComponent({
      type: 'formly-group',
      fieldGroup: [{ key: 'title1' }, { key: 'title2' }],
    });

    expect(getFormlyGroupField(fixture)).toBeDefined();
    expect(getFormlyGroupFields(fixture).length).toEqual(2);
  });

  it('should add fieldGroupClassName', () => {
    const fixture = renderComponent({
      fieldGroupClassName: 'foo-class',
      type: 'formly-group',
    });

    expect(getFormlyGroupField(fixture).getAttribute('class')).toEqual('foo-class');
  });
});
