# React-Time-TextField

A controlled Material-UI TextField for keyboard time input.

## Quick Start

- Install by executing `npm install react-time-textfield` or `yarn add react-time-textfield`.
- Import by adding `import { ReactTimeTextField } from 'react-time-textfield'`.
- Use by adding `<ReactTimeTextField />`. Assign callback to `onBlur` prop to receive new value.
- Hours/Minutes/Meridiem can be input using both keyboard and up/down arrows. Use Tab and right/left arrows to navigate.


## Getting started

### Installation

Add React-Time-TextField to your project by executing `npm install react-time-textfield` or `yarn add react-time-textfield`.

### Usage

Here is an example of basic usage:

```js
import React, { useState } from 'react';
import { ReactTimeTextField } from 'react-time-textfield';

function MyApp() {
  const [value, setValue] = useState(new Date());

  return (
   <ReactTimeTextField
    value={value}
    label='Start Time'
    onBlur={setValue}
   />
  );
}
```

### Custom styling

ReactTimeTextField uses Material-UI TextField. Just pass any styling-related props that the Mui TextField component uses and they will be applied:
```
 <ReactTimeTextField
  value={value}
  label='Start Time'
  onBlur={setValue}
  size='large'
  styles={{ width: '100px', height: '60px' }}
 />
```

NOTE: *onChange*, *onKeyDown*, and *onClick* props are used internally and are not available. Use *onBlur* callback to receive date object with specified time value.



## License

The MIT License.

## Author
[Patrick S. Young](https://github.com/patrick-s-young)
