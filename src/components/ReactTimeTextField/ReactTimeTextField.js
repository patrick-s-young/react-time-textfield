// React
import { useRef, useEffect, useReducer } from 'react';
// reducer
import { reducer, initialState } from './reducer';
// material
import { TextField } from '@mui/material';
// helpers
import { format } from 'date-fns';
import _ from 'lodash';



///////////////////
// BEGIN COMPONENT
export const ReactTimeTextField = ({
  value,
  label,
  onBlur,
  disabled,
  size,
  variant,
  autoComplete,
  ...rest
}) => {
  const textFieldRef = useRef();
  const keyDownTimer = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    redrawCounter,
    selected,
    SELECTED_RANGE,
    time
  } = state;


  const onClickToSelect = () => {
    dispatch({ type: 'clickToSelect',  selectionStart: textFieldRef.current.selectionStart });
  };

  // DETERMINE VALID INPUT
  const onChange = ({ target: { value } }) => {
    dispatch({ type: 'validateInput', value, keyDownTimer });
  }

  const onKeyDown = (event) => {
    if (selected === 'none') return;
    dispatch({ type: 'keyDown', event, textFieldRef })
  }
    
  function parseTime(timeStr) {
    const [hours, minutes, meridiem] = timeStr.split(/[:\s]/);
    return {
      hours: String(Number(hours)).padStart(2, ' '),
      minutes,
      meridiem
    }
  }

  const onBlurHandler = () => {
    const newStartDateTime = new Date(value);
    newStartDateTime.setHours((time.meridiem === 'PM' && time.hours < 12) ? Number(time.hours) + 12 : Number(time.hours));
    newStartDateTime.setMinutes(time.minutes);
    dispatch({ type: 'setSelected', selected: 'none' });
    onBlur(newStartDateTime);
  }

  useEffect(() => {
    if (disabled === true || textFieldRef.current === undefined) return;
    keyDownTimer.current = Date.now();
    textFieldRef.current.selectionStart = 0;
    textFieldRef.current.selectionEnd = 0;
    textFieldRef.current.selectionStart = SELECTED_RANGE[selected].start;
    textFieldRef.current.selectionEnd = SELECTED_RANGE[selected].end;
  }, [redrawCounter, selected, time, disabled]);

  useEffect(() => {
    if (_.isDate(value)) dispatch({ type: 'setTime', time: parseTime(format(new Date(value), 'hh:mm aa')) });
  }, [value]);


  //////////
  // RETURN
  return (
    <>
      <>{disabled !== true &&
        <TextField
          size={size ?? 'small'}
          variant={variant ?? 'outlined'}
          label={label}
          value={time === null ? '' : `${time.hours}:${time.minutes} ${time.meridiem}`}
          inputRef={textFieldRef}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onClick={onClickToSelect}
          onBlur={onBlurHandler}
          autoComplete={autoComplete ?? 'off'}
          {...rest}
        />
      }</>

      <> {disabled === true &&
        <TextField
          size={size ?? 'small'}
          variant={variant ?? 'outlined'}
          label={label}
          disabled={true}
          value={time === null ? '' : `${time.hours}:${time.minutes} ${time.meridiem}`}
          {...rest}
        />

      }
      </>
    </>
  );
}

