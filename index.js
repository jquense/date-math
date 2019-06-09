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

var dates = module.exports = {

  add: function(d, num, unit) {
    d = new Date(d)

    switch (unit){
      case MILI:
      case SECONDS:
      case MINUTES:
      case HOURS:
      case YEAR:
        return dates[unit](d, dates[unit](d) + num)
      case DAY:
        return dates.date(d, dates.date(d) + num)
      case WEEK:
        return dates.date(d, dates.date(d) + (7 * num))
      case MONTH:
        return monthMath(d, num)
      case DECADE:
        return dates.year(d, dates.year(d) + (num * 10))
      case CENTURY:
        return dates.year(d, dates.year(d) + (num * 100))
    }

    throw new TypeError('Invalid units: "' + unit + '"')
  },

  subtract: function(d, num, unit) {
    return dates.add(d, -num, unit)
  },

  startOf: function(d, unit, firstOfWeek) {
    d = new Date(d)

    switch (unit) {
      case 'century':
      case 'decade':
      case 'year':
          d = dates.month(d, 0);
      case 'month':
          d = dates.date(d, 1);
      case 'week':
      case 'day':
          d = dates.hours(d, 0);
      case 'hours':
          d = dates.minutes(d, 0);
      case 'minutes':
          d = dates.seconds(d, 0);
      case 'seconds':
          d = dates.milliseconds(d, 0);
    }

    if (unit === DECADE)
      d = dates.subtract(d, dates.year(d) % 10, 'year')

    if (unit === CENTURY)
      d = dates.subtract(d, dates.year(d) % 100, 'year')

    if (unit === WEEK)
      d = dates.weekday(d, 0, firstOfWeek);

    return d
  },


  endOf: function(d, unit, firstOfWeek){
    d = new Date(d)
    d = dates.startOf(d, unit, firstOfWeek)
    d = dates.add(d, 1, unit)
    d = dates.subtract(d, 1, MILI)
    return d
  },

  eq:  createComparer(function(a, b){ return a === b }),
  neq: createComparer(function(a, b){ return a !== b }),
  gt:  createComparer(function(a, b){ return a > b }),
  gte: createComparer(function(a, b){ return a >= b }),
  lt:  createComparer(function(a, b){ return a < b }),
  lte: createComparer(function(a, b){ return a <= b }),

  min: function(){
    return new Date(Math.min.apply(Math, arguments))
  },

  max: function(){
    return new Date(Math.max.apply(Math, arguments))
  },

  inRange: function(day, min, max, unit){
    unit = unit || 'day'

    return (!min || dates.gte(day, min, unit))
        && (!max || dates.lte(day, max, unit))
  },

  milliseconds:   createAccessor('Milliseconds'),
  seconds:        createAccessor('Seconds'),
  minutes:        createAccessor('Minutes'),
  hours:          createAccessor('Hours'),
  day:            createAccessor('Day'),
  date:           createAccessor('Date'),
  month:          createAccessor('Month'),
  year:           createAccessor('FullYear'),

  decade: function (d, val) {
    return val === undefined
      ? dates.year(dates.startOf(d, DECADE))
      : dates.add(d, val + 10, YEAR);
  },

  century: function (d, val) {
    return val === undefined
      ? dates.year(dates.startOf(d, CENTURY))
      : dates.add(d, val + 100, YEAR);
  },

  weekday: function (d, val, firstDay) {
      var weekday = (dates.day(d) + 7 - (firstDay || 0) ) % 7;

      return val === undefined
        ? weekday
        : dates.add(d, val - weekday, DAY);
  },

  diff: function (date1, date2, unit, asFloat) {
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
        dividend = (dates.year(date2) - dates.year(date1)) * 12 + dates.month(date2) - dates.month(date1); break;
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
};

function monthMath(d, val){
  var current = dates.month(d)
    , newMonth  = (current + val);

    d = dates.month(d, newMonth)

    while (newMonth < 0 ) newMonth = 12 + newMonth

    //month rollover
    if ( dates.month(d) !== ( newMonth % 12))
      d = dates.date(d, 0) //move to last of month

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

    dateOut = new Date(d)
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
    return operator(+dates.startOf(a, unit), +dates.startOf(b, unit))
  };
}
