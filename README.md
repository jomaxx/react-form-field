# react-form-field

## Install
```
npm i react-form-field --save
```

## Basic Usage

```js
import React from 'react';
import { Form, Field } from 'react-form-field';

export default function MyForm({ onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <Field
        defaultValue="example"
        validate={val => val ? undefined : 'Required!'}
      >
        {({ touched, touch, update, error, value }) =>
          <div>
            <input
              type="text"
              onChange={update} // update value and touch field
              onBlur={touch} // touch field
              value={value}
            />

            {touched && error &&
              <p style={{ color: 'red' }}>{error}</p>
            }
          </div>
        }
      </Field>
    </Form>
  );
}

```
