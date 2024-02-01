import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPresetModule } from '@ngx-formly/core/preset';
import { AppComponent } from './app.component';
import { FormlyInputModule } from '@ngx-formly/core/testing';

describe('Preset AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormlyInputModule,
        FormlyModule.forRoot({}),
        FormlyPresetModule.forRoot([
          { name: 'salutation', config: { type: 'input' } },
          { name: 'firstName', config: { type: 'input' } },
          { name: 'lastName', config: { type: 'input' } },
        ]),
      ],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render all fields', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-type-input')).toHaveLength(3);
  });
});
