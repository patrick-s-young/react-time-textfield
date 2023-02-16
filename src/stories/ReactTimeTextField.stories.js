import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { ReactTimeTextField } from '../components/ReactTimeTextField';

const stories = storiesOf('App Test', module);

stories.add('App', () => {
  const [value,  setValue] = useState(new Date());


  return (
    <>
    <ReactTimeTextField
      value={value}
      label='Start Time'
      onBlur={setValue}
      disabled={false}
      style={{ width: '100px'}}
    />
      <div style={{ marginTop: '50px', fontSize: '1.1em'}}>{value.toString()}</div>
    </>
  );
});