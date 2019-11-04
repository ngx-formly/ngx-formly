import { createFormlyFieldComponent as renderComponent } from '@ngx-formly/core/testing';
import { ComponentFixture } from '@angular/core/testing';

function getFormlyTemplateField(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('formly-template');
}

describe('Template Field Type', () => {
  it('should render template', () => {
    const fixture = renderComponent({
      template: '<div>Nested property keys</div>',
    });

    expect(getFormlyTemplateField(fixture)).toBeDefined();
    expect(getFormlyTemplateField(fixture).innerText).toEqual('Nested property keys');
  });
});
