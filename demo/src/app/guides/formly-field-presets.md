# Formly Field Presets
With formly templates, wrappers and extensions, it's easy to reuse form logic throughout your app. However, in larger projects, you will often find yourself defining the same things over and over; think of common form fields like email, name or password fields which should be the same throughout your app.

The `@ngx-formly/core/preset` enables you to define reusable `FormlyFieldConfig`s centrally. 

## Defining a Preset
To define a preset, two steps are necessary:
- Importing the `FormlyPresetModule` 
- Providing presets to `FormlyConfig`

Have a look at the following example which defines a simple `firstName` preset:

```typescript
@NgModule({
  imports: [
    ...
    FormlyPresetModule,
    FormlyModule.forRoot({
      presets: [
        {
          name: 'firstName',
          config: {
            key: 'firstName',
            type: 'input',
            props: {
              label: 'First Name',
            },
          },
        },
      ],
    }),
  ],
})
export class AppModule {}

```

It is also possible to define more complex presets by using a `FormlyFieldConfigPresetProvider` (which contains only a single `getConfiguration` method). This enables presets that contain dependencies and can be self-configuring.
Refer to [Example: Presets](https://formly.dev/examples/other/presets) to see this behavior in action.

## Using Presets
After you have defined a preset, it's very easy to use them in your forms. Presets are accessed using so-called *pseudo-types*, which are prefixed with a single `#`:

```typescript
fieldConfig = [
  ...
  {
    type: '#firstName'
  }
]
```

This will substitute all properties with those defined in the preset. 

To reuse fields while overriding only certain properties, simply specify those properties:

```typescript
fieldConfig = [
  ...
  {
    type: '#firstName'
    props: {
      label: 'alternative label'
    }
  }
]
```
