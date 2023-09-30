
export const initialState = {
  time: null,   // Time obj 'hours', 'minutes', 'meridiem'
  selected: 'none',
  redrawCounter: 0,
  SELECTED_RANGE: {
    none: { start: 0, end: 0 },
    hours: { start: 0, end: 2, previous: 'meridiem', next: 'minutes', pattern: /^[0-9]+$/ },
    minutes: { start: 3, end: 5, previous: 'hours', next: 'meridiem', pattern: /^[0-9]+$/ },
    meridiem: { start: 6, end: 8, previous: 'minutes', next: 'hours', pattern: /^[AMP]/ }
  }
};


export const reducer = (state, action) => {
  let _time, _selected;

  switch (action.type) {
  // DETERMINE WHICH ELEMENT OF TIME INPUT TO SELECT/HIGHLIGHT (i.e. HOURS, MINS, AM/PM)
    case 'clickToSelect':
      const selectionStart = { action };
      _selected = 'meridiem';
      if (selectionStart < state.SELECTED_RANGE.hours.end + 1) {
        _selected = 'hours';
      } else if (selectionStart < state.SELECTED_RANGE.minutes.end) {
        _selected = 'minutes';
      } 
      return {
        ...state,
        selected: _selected,
        redrawCounter: state.redrawCounter + 1
      };
  // DETERMIN IF INPUT IS VALID RELATIVE TO 'hour', 'minutes', 'meridiem'
    case 'validateInput':
      const { value, keyDownTimer } = action;
      let [_hours, _minutes, _meridiem] = (value.trim()).split(/[:\s]/);
      const _timeNow = Date.now();
      // UPDATE HOURS
      if (state.selected === 'hours') {
        if (state.SELECTED_RANGE.hours.pattern.test(_hours) === false) break;
        _hours = Number(_hours);
        const _prevHours = Number(state.time.hours);
        let _hoursFormatted;
        if (_timeNow - keyDownTimer.current < 500) {
          _hoursFormatted = (_prevHours === 1 && _hours < 3) ? '1' + _hours : _hours === 0 ?  state.time.hours : ' ' + _hours;
        } else {
          _hoursFormatted = _hours === 0 ? state.time.hours : ' ' + _hours;
        } 
        return {
          ...state,
          time:  {...state.time, hours: _hoursFormatted },
          redrawCounter: state.redrawCounter + 1
        }
      }
      // UPDATE MINUTES
      if (state.selected === 'minutes') {
        if (state.SELECTED_RANGE.minutes.pattern.test(_minutes) === false) break;
        _minutes = Number(_minutes);
        let _minutesFormatted;
        const _prevMinutes = Number(state.time.minutes);
        if (_timeNow - keyDownTimer.current < 500) {
          _minutesFormatted = _prevMinutes < 6 ? `${_prevMinutes}${_minutes}` : '0' + _minutes;
        } else {
          _minutesFormatted = '0' + _minutes;
        }
        return { 
          ...state,
          time: {...state.time, minutes: _minutesFormatted },
          redrawCounter: state.redrawCounter + 1
        }
      }
      // UPDATE MERIDIEM
      if (state.selected === 'meridiem') {
        let _meridiemFormatted;
        const _prevMeridiem = state.time.meridiem;
        if (_meridiem[0].toUpperCase() === 'A' || _meridiem[0].toUpperCase() === 'P') {
            _meridiemFormatted = `${_meridiem[0].toUpperCase()}M`;
          } else {
            _meridiemFormatted = _prevMeridiem;
          }
          return { 
            ...state,
            time: {...state.time, meridiem: _meridiemFormatted },
            redrawCounter: state.redrawCounter + 1
          }
      }
      return {
        ...state,
        redrawCounter: state.redrawCounter + 1
      }
  // DETERMINE IF 'Enter', 'Tab' OR ARROW KEYS HAVE BEEN PRESSED 
    case 'keyDown':
      const { event, textFieldRef } = action;
      const { code } = event;
      if (code === 'Enter') {
        textFieldRef.current.blur();
        _selected = 'none'
      }
      if (['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(code)) {
        event.preventDefault();
        if (code === 'Tab' || code === 'ArrowRight') _selected = state.SELECTED_RANGE[state.selected].next;
        if (code === 'ArrowLeft') _selected = state.SELECTED_RANGE[state.selected].previous;
        if (code === 'ArrowUp') _time = bumpSelected({ direction: 'up', time: state.time, selected: state.selected });
        if (code === 'ArrowDown') _time = bumpSelected({ direction: 'down', time: state.time, selected: state.selected });
      }
      return {
        ...state,
        selected: _selected ?? state.selected,
        time: _time ?? state.time
      }

    case 'setSelected': 
      const { selected } = action;
      return {
        ...state,
        selected
      }

    case 'setTime': 
      const { time } = action;
      return {
        ...state,
        time
      }

    default:
      console.log(`reducer > no matching case for ${action.type}`);
  }
}


// Helper
const bumpSelected = ({ direction, time, selected }) => {
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
}