"use strict";var e=require("react"),t=require("@mui/material"),r=require("date-fns"),n=require("lodash");function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},u.apply(this,arguments)}const i={none:{start:0,end:0},hours:{start:0,end:2,previous:"meridiem",next:"minutes",pattern:/^[0-9]+$/},minutes:{start:3,end:5,previous:"hours",next:"meridiem",pattern:/^[0-9]+$/},meridiem:{start:6,end:8,previous:"minutes",next:"hours",pattern:/^[AMP]/}};exports.ReactTimeTextField=({value:s,label:a,onBlur:o,disabled:m,...l})=>{const[c,d]=e.useState("none"),[p,h]=e.useState(null),[f,b]=e.useState(0),v=e.useRef(),w=e.useRef(null),g=()=>b((e=>e+1)),S=e=>{h((t=>{let{hours:r,minutes:n,meridiem:u}=t;return"hours"===c&&(r="up"===e?"12"===r?" 1":String(Number(r)+1).padStart(2," "):" 1"===r?"12":String(Number(r)-1).padStart(2," ")),"minutes"===c&&(n="up"===e?"59"===n?"00":String(Number(n)+1).padStart(2,"0"):"00"===n?"59":String(Number(n)-1).padStart(2,"0")),"meridiem"===c&&(u="AM"===u?"PM":"AM"),{hours:r,minutes:n,meridiem:u}}))};return e.useEffect((()=>{!0!==m&&void 0!==v.current&&(w.current=Date.now(),v.current.selectionStart=0,v.current.selectionEnd=0,v.current.selectionStart=i[c].start,v.current.selectionEnd=i[c].end)}),[f,c,p,m]),e.useEffect((()=>{n.isDate(s)&&h(function(e){const[t,r,n]=e.split(/[:\s]/);return{hours:String(Number(t)).padStart(2," "),minutes:r,meridiem:n}}(r.format(new Date(s),"hh:mm aa")))}),[s]),React.createElement(React.Fragment,null,React.createElement(React.Fragment,null,!0!==m&&React.createElement(t.TextField,u({size:"small",name:"value",variant:"outlined",label:a,value:null===p?"":`${p.hours}:${p.minutes} ${p.meridiem}`,inputRef:v,onChange:({target:{value:e}})=>{let[t,r,n]=e.trim().split(/[:\s]/);const u=Date.now();if("hours"===c){if(!1===i.hours.pattern.test(t))return void g();t=Number(t),h((e=>{const r=Number(e.hours);let n;return n=u-w.current<500?1===r&&t<3?"1"+t:" "+t:0===Number(t)?e.hours:" "+t,{...e,hours:n}}))}if("minutes"===c){if(console.log("minutes",r),!1===i.minutes.pattern.test(r))return void g();r=Number(r),h((e=>{let t;const n=Number(e.minutes);return t=u-w.current<500?n<6?`${n}${r}`:"0"+r:r>0?"0"+r:n,{...e,minutes:t}}))}"meridiem"===c&&h((e=>{let t;const r=e.meridiem;return t="A"===n[0].toUpperCase()||"P"===n[0].toUpperCase()?`${n[0].toUpperCase()}M`:r,{...e,meridiem:t}})),g()},onKeyDown:e=>{if("none"===c)return;const{code:t}=e;if("Enter"===t)return v.current.blur(),void d("none");["Tab","ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(t)&&e.preventDefault(),"Tab"!==t&&"ArrowRight"!==t||d((e=>i[e].next)),"ArrowLeft"===t&&d((e=>i[e].previous)),"ArrowUp"===t&&S("up"),"ArrowDown"===t&&S("down")},onClick:()=>{const e=v.current.selectionStart;e<i.hours.end+1?d("hours"):e<i.minutes.end?d("minutes"):d("meridiem"),g()},onBlur:()=>{const e=new Date(s);e.setHours("PM"===p.meridiem&&p.hours<12?Number(p.hours)+12:Number(p.hours)),e.setMinutes(p.minutes),d("none"),o(e)},autoComplete:"off"},l))),React.createElement(React.Fragment,null," ",!0===m&&React.createElement(t.TextField,u({size:"small",name:"value",variant:"outlined",disabled:!0,label:a,value:null===p?"":`${p.hours}:${p.minutes} ${p.meridiem}`},l))))};
