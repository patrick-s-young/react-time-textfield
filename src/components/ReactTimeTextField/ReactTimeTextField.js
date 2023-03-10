import { useState, useRef, useEffect } from 'react';
import { TextField } from '@mui/material';
import { format } from 'date-fns';
import _ from 'lodash';

// DIVIDE TEXTFIELD INTO CONTROLLED RANGES
const SELECTED_RANGE = {
  none: { start: 0, end: 0 },
  hours: { start: 0, end: 2, previous: 'meridiem', next: 'minutes', pattern: /^[0-9]+$/ },
  minutes: { start: 3, end: 5, previous: 'hours', next: 'meridiem', pattern: /^[0-9]+$/ },
  meridiem: { start: 6, end: 8, previous: 'minutes', next: 'hours', pattern: /^[AMP]/ }
}


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
  // Selection range of textfield input
  const [selected, setSelected] = useState('none');
  // Time obj 'hours', 'minutes', 'meridiem'
  const [time, setTime] = useState(null);
  // Control selected range
  const textFieldRef = useRef();
  // Redraw to update textFieldRef range values
  const [redrawCounter, setRedrawCounter] = useState(0);
  // Detect quick succession of key strokes
  const keyDownTimer = useRef(null);


  // DETERMINE WHICH ELEMENT OF TIME INPUT TO SELECT/HIGHLIGHT (i.e. HOURS, MINS, AM/PM)
  const onClickToSelect = () => {
    const selectionStart = textFieldRef.current.selectionStart;
    if (selectionStart < SELECTED_RANGE.hours.end + 1) {
      setSelected('hours');
    } else if (selectionStart < SELECTED_RANGE.minutes.end) {
      setSelected('minutes');
    } else {
      setSelected('meridiem');
    }
    redraw();
  };

  // DETERMINE VALID INPUT
  const onChange = ({ target: { value } }) => {
    let [hours, minutes, meridiem] = (value.trim()).split(/[:\s]/);
    const timeNow = Date.now();
    // UPDATE HOURS
    if (selected === 'hours') {
      if (SELECTED_RANGE.hours.pattern.test(hours) === false) { redraw(); return };
      hours = Number(hours);
      setTime((time) => {
        const prevHours = Number(time.hours);
        let hoursFormatted;
        if (timeNow - keyDownTimer.current < 500) {
          hoursFormatted = (prevHours === 1 && hours < 3) ? '1' + hours : hours === 0 ?  time.hours : ' ' + hours;
        } else if (Number(hours) === 0) {
          hoursFormatted = time.hours;
        } else {
          hoursFormatted = ' ' + hours;
        }
        return { ...time, hours: hoursFormatted };
      })
    }
    // UPDATE MINUTES
    if (selected === 'minutes') {
      if (SELECTED_RANGE.minutes.pattern.test(minutes) === false) { redraw(); return };
      minutes = Number(minutes);
      setTime((time) => {
        let minutesFormatted;
        const prevMinutes = Number(time.minutes);
        if (timeNow - keyDownTimer.current < 500) {
          minutesFormatted = prevMinutes < 6 ? `${prevMinutes}${minutes}` : '0' + minutes;
        } else {
          minutesFormatted = '0' + minutes;
        }
        return { ...time, minutes: minutesFormatted };
      });
    }
    // UPDATE MERIDIEM
    if (selected === 'meridiem') {
      setTime((time) => {
        //if (SELECTED_RANGE.meridiem.pattern.test(meridiem) === false) return { ...time };
        let meridiemFormatted;
        const prevMeridiem = time.meridiem;
        if (meridiem[0].toUpperCase() === 'A' || meridiem[0].toUpperCase() === 'P') {
          meridiemFormatted = `${meridiem[0].toUpperCase()}M`;
        } else {
          meridiemFormatted = prevMeridiem;
        }
        return { ...time, meridiem: meridiemFormatted };
      });
    }
    redraw();
  }

  // DETERMINE IF 'Enter', 'Tab' OR ARROW KEYS HAVE BEEN PRESSED
  const onKeyDown = (event) => {
    if (selected === 'none') return;
    const { code } = event;

    if (code === 'Enter') {
      textFieldRef.current.blur();
      setSelected('none');
      return;
    }
    if (['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(code)) event.preventDefault();
    if (code === 'Tab' || code === 'ArrowRight') setSelected(selected => SELECTED_RANGE[selected].next);
    if (code === 'ArrowLeft') setSelected(selected => SELECTED_RANGE[selected].previous);
    if (code === 'ArrowUp') bumpSelected('up');
    if (code === 'ArrowDown') bumpSelected('down');
  };

  // INCREMENT/DECREMENT HOURS/MINUTES & TOGGLE AM/PM
  const bumpSelected = (direction) => {
    setTime(time => {
      let { hours, minutes, meridiem } = time;
      if (selected === 'hours') {
        if (direction === 'up') {
          hours = hours === '12' ? ' 1' : String(Number(hours) + 1).padStart(2, ' ');
        } else {
          hours = hours === ' 1' ? '12' : String(Number(hours) - 1).padStart(2, ' ')
        }
      }

      if (selected === 'minutes') {
        if (direction === 'up') {
          minutes = minutes === '59' ? '00' : String(Number(minutes) + 1).padStart(2, '0');
        } else {
          minutes = minutes === '00' ? '59' : String(Number(minutes) - 1).padStart(2, '0')
        }
      }

      if (selected === 'meridiem') {
        meridiem = meridiem === 'AM' ? 'PM' : 'AM';
      }

      return { hours, minutes, meridiem }
    });
  }

  // BREAK TIME STRING INTO hours/minutes/meridiem OBJ
  function parseTime(timeStr) {
    const [hours, minutes, meridiem] = timeStr.split(/[:\s]/);
    return {
      hours: String(Number(hours)).padStart(2, ' '),
      minutes,
      meridiem
    }
  }

  // ON BLUR
  const onBlurHandler = () => {
    const newStartDateTime = new Date(value);
    newStartDateTime.setHours((time.meridiem === 'PM' && time.hours < 12) ? Number(time.hours) + 12 : Number(time.hours));
    newStartDateTime.setMinutes(time.minutes);
    setSelected('none');
    onBlur(newStartDateTime);
  }

  // TRIGGER REDRAW TO UPDATE textFieldRef values 
  const redraw = () => setRedrawCounter(redrawCounter => redrawCounter + 1);

  // UPDATE textFieldRef VALUES
  useEffect(() => {
    if (disabled === true || textFieldRef.current === undefined) return;
    keyDownTimer.current = Date.now();
    textFieldRef.current.selectionStart = 0;
    textFieldRef.current.selectionEnd = 0;
    textFieldRef.current.selectionStart = SELECTED_RANGE[selected].start;
    textFieldRef.current.selectionEnd = SELECTED_RANGE[selected].end;
  }, [redrawCounter, selected, time, disabled]);

  // FORMAT PROP 'value' INTO 'time' OBJ
  useEffect(() => {
    if (_.isDate(value)) setTime(parseTime(format(new Date(value), 'hh:mm aa')));
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

