
/**
*/
XT = window.XT = {};

/**
*/
XM = window.XM = {};

/**
*/
enyo.mixin(XT,
  /** */ {
    
  /** */
  K: function(){},
  
  /** */
  _date: new Date(),
  
  /** */
  toReadableTimestamp: function(millis) {
    var re = XT._date || (XT._date = new Date());
    re.setTime(millis);
    return re.toLocaleTimeString();
  }

});