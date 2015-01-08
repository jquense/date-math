var assert = require('assert')
  , dateMath = require('./index')

var now = new Date
  , date = new Date( 
      2014 /* year */ 
    , 1    /* month */ 
    , 18   /* day */ 
    , 8    /* hour */ 
    , 25   /* min */ 
    , 30   /* sec */ 
    , 5);  /* ms */ 

console.log('---- Accessors ----------------------------')
//accessors
assert.equal(dateMath.year(date), 2014, 'year is equal to 2014')
assert.equal(dateMath.month(date), 1,    'month is equal to 1')
assert.equal(dateMath.date(date), 18,   'date is equal to 18')
assert.equal(dateMath.day(date), 2,   'day is equal to 2')
assert.equal(dateMath.hours(date), 8,    'hour is equal to 8')
assert.equal(dateMath.minutes(date), 25,   'minute is equal to 25')
assert.equal(dateMath.seconds(date), 30,   'seconds is equal to 30')
assert.equal(dateMath.milliseconds(date), 5,    'ms is equal to 5')

console.log('---- start of ----------------------------')

assert.equal(+dateMath.startOf(date, 'year'), +(new Date(2014,0,1,0,0,0,0)), 'startOf year')
assert.equal(+dateMath.startOf(date, 'month'), +(new Date(2014,1,1,0,0,0,0)), 'startOf month')
assert.equal(+dateMath.startOf(date, 'day'), +(new Date(2014,1,18,0,0,0,0)), 'startOf day')
assert.equal(+dateMath.startOf(date, 'week'), +(new Date(2014,1,16,0,0,0,0)), 'startOf day')
assert.equal(+dateMath.startOf(date, 'hours'), +(new Date(2014,1,18,8,0,0,0)), 'startOf hours')
assert.equal(+dateMath.startOf(date, 'minutes'), +(new Date(2014,1,18,8,25,0,0)), 'startOf minutes')
assert.equal(+dateMath.startOf(date, 'seconds'), +(new Date(2014,1,18,8,25,30,0)), 'startOf seconds')


console.log('---- Date Math ----------------------------')

assert.ok(dateMath.eq(date,  new Date(2014,0,1,0,0,0,0),  'year'), 'eq year')
assert.ok(dateMath.lte(date,  new Date(2014,0,1,0,0,0,0), 'year'), 'lte year')
assert.ok(dateMath.lte(date,  new Date(2015,0,1,0,0,0,0), 'year'), 'lte year')
assert.ok(dateMath.lt(date,  new Date(2015,0,1,0,0,0,0),  'year'), 'lt year')
assert.ok(dateMath.gte(date,  new Date(2014,0,1,0,0,0,0), 'year'), 'gte year')
assert.ok(dateMath.gte(date,  new Date(2013,0,1,0,0,0,0), 'year'), 'gte year')
assert.ok(dateMath.gt(date,  new Date(2013,0,1,0,0,0,0),  'year'), 'gt year')


assert.ok(dateMath.inRange(date,  new Date(2013,0,1,0,0,0,0),  new Date(2014,5,1,0,0,0,0)), 'inRange year')
assert.ok(!dateMath.inRange(new Date(2013,0,1,0,0,0,0), date,  new Date(2014,5,1,0,0,0,0)), 'inRange year')
assert.ok(dateMath.inRange(date,  null,  new Date(2014,5,1,0,0,0,0)), 'inRange year')
assert.ok(dateMath.inRange(date,  new Date(2013,0,1,0,0,0,0), null), 'inRange year')

