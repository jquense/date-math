var MILI    = 'milliseconds'
  , SECONDS = 'seconds'
  , MINUTES = 'minutes'
  , HOURS   = 'hours'
  , DAY     = 'day'
  , WEEK    = 'week'
  , MONTH   = 'month'
  , YEAR    = 'year'
  , DECADE  = 'decade'
  , CENTURY = 'century';

export function add(d, num, unit) {
  d = new Date(d)

  switch (unit){
    case MILI:
      return milliseconds(d, milliseconds(d) + num)
    case SECONDS:
      return seconds(d, seconds(d) + num)
    case MINUTES:
      return minutes(d, minutes(d) + num)
    case HOURS:
      return hours(d, hours(d) + num)
    case YEAR:
      return year(d, year(d) + num)
    case DAY:
      return date(d, date(d) + num)
    case WEEK:
      return date(d, date(d) + (7 * num))
    case MONTH:
      return monthMath(d, num)
    case DECADE:
      return year(d, year(d) + (num * 10))
    case CENTURY:
      return year(d, year(d) + (num * 100))
  }

  throw new TypeError('Invalid units: "' + unit + '"')
}

export function subtract(d, num, unit) {
  return add(d, -num, unit)
}

export function startOf(d, unit, firstOfWeek) {
  d = new Date(d)

  switch (unit) {
    case CENTURY:
    case DECADE:
    case YEAR:
        d = month(d, 0);
    case MONTH:
        d = date(d, 1);
    case WEEK:
    case DAY:
        d = hours(d, 0);
    case HOURS:
        d = minutes(d, 0);
    case MINUTES:
        d = seconds(d, 0);
    case SECONDS:
        d = milliseconds(d, 0);
  }

  if (unit === DECADE)
    d = subtract(d, year(d) % 10, 'year')

  if (unit === CENTURY)
    d = subtract(d, year(d) % 100, 'year')

  if (unit === WEEK)
    d = weekday(d, 0, firstOfWeek);

  return d
}

export function endOf(d, unit, firstOfWeek){
  d = new Date(d)
  d = startOf(d, unit, firstOfWeek)
  d = add(d, 1, unit)
  d = subtract(d, 1, MILI)
  return d
}

export var eq =  createComparer(function(a, b){ return a === b })
export var neq = createComparer(function(a, b){ return a !== b })
export var gt =  createComparer(function(a, b){ return a > b })
export var gte = createComparer(function(a, b){ return a >= b })
export var lt =  createComparer(function(a, b){ return a < b })
export var lte = createComparer(function(a, b){ return a <= b })

export function min(){
  return new Date(Math.min.apply(Math, arguments))
}

export function max(){
  return new Date(Math.max.apply(Math, arguments))
}

export function inRange(day, min, max, unit){
  unit = unit || 'day'

  return (!min || gte(day, min, unit))
      && (!max || lte(day, max, unit))
}

export var milliseconds = createAccessor('Milliseconds')
export var seconds =      createAccessor('Seconds')
export var minutes =      createAccessor('Minutes')
export var hours =        createAccessor('Hours')
export var day =          createAccessor('Day')
export var date =         createAccessor('Date')
export var month =        createAccessor('Month')
export var year =         createAccessor('FullYear')

export function decade(d, val) {
  return val === undefined
    ? year(startOf(d, DECADE))
    : add(d, val + 10, YEAR);
}

export function century(d, val) {
  return val === undefined
    ? year(startOf(d, CENTURY))
    : add(d, val + 100, YEAR);
}

export function weekday(d, val, firstDay) {
    var w = (day(d) + 7 - (firstDay || 0) ) % 7;

    return val === undefined
      ? w
      : add(d, val - w, DAY);
}

export function diff(date1, date2, unit, asFloat) {
  var dividend, divisor, result;

  switch (unit) {
    case MILI:
    case SECONDS:
    case MINUTES:
    case HOURS:
    case DAY:
    case WEEK:
      dividend = date2.getTime() - date1.getTime(); break;
    case MONTH:
    case YEAR:
    case DECADE:
    case CENTURY:
      dividend = (year(date2) - year(date1)) * 12 + month(date2) - month(date1); break;
    default:
      throw new TypeError('Invalid units: "' + unit + '"');
  }

  switch (unit) {
    case MILI:
        divisor = 1; break;
    case SECONDS:
        divisor = 1000; break;
    case MINUTES:
        divisor = 1000 * 60; break;
    case HOURS:
        divisor = 1000 * 60 * 60; break;
    case DAY:
        divisor = 1000 * 60 * 60 * 24; break;
    case WEEK:
        divisor = 1000 * 60 * 60 * 24 * 7; break;
    case MONTH:
        divisor = 1; break;
    case YEAR:
        divisor = 12; break;
    case DECADE:
        divisor = 120; break;
    case CENTURY:
        divisor = 1200; break;
    default:
      throw new TypeError('Invalid units: "' + unit + '"');
  }

  result = dividend / divisor;

  return asFloat ? result : Math.round(result);
}

function monthMath(d, val){
  var current = month(d)
    , newMonth  = (current + val);

    d = month(d, newMonth)

    while (newMonth < 0 ) newMonth = 12 + newMonth

    //month rollover
    if ( month(d) !== ( newMonth % 12))
      d = date(d, 0) //move to last of month

    return d
}

function createAccessor(method){
  var hourLength = (function(method) {  
    switch(method) {
      case 'Milliseconds':
        return 3600000;
      case 'Seconds':
        return 3600;
      case 'Minutes':
        return 60;
      case 'Hours':
        return 1;
      default:
        return -1;
    }
  })(method);
  
  return function(d, val){
    if (val === undefined)
      return d['get' + method]()

    var dateOut = new Date(d)
    dateOut['set' + method](val)
    
    if(dateOut['get'+method]() != val && (method === 'Hours' || val >=hourLength && (dateOut.getHours()-d.getHours()<Math.floor(val/hourLength))) ){
      //Skip DST hour, if it occurs
      dateOut['set'+method](val+hourLength);
    }
    
    return dateOut
  }
}

function createComparer(operator) {
  return function (a, b, unit) {
    return operator(+startOf(a, unit), +startOf(b, unit))
  };
}
