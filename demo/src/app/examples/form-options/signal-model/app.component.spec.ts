import { createComponent } from '@ngx-formly/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('Signal model example', () => {
  it('keeps the inputs and the computed name in sync with the model signal', async () => {
    const { query, queryAll, detectChanges, fixture } = createComponent({
      template: '<formly-app-example />',
      inputs: {},
      imports: [AppComponent],
      providers: appConfig.providers,
    });
    const example: AppComponent = query('formly-app-example').componentInstance;
    const [firstName, lastName] = queryAll<HTMLInputElement>('input').map((el) => el.nativeElement);
    const fullName = () => query('strong').nativeElement.textContent;

    expect(fullName()).toBe('Ada Lovelace');

    firstName.value = 'Augusta';
    firstName.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    detectChanges();
    expect(example.model().firstName).toBe('Augusta');
    expect(fullName()).toBe('Augusta Lovelace');

    (query('button').nativeElement as HTMLButtonElement).click();
    await fixture.whenStable();
    detectChanges();
    expect(firstName.value).toBe('Grace');
    expect(lastName.value).toBe('Hopper');
    expect(fullName()).toBe('Grace Hopper');
  });
});
