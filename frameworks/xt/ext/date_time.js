// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class 
  An extension of `SC.DateTime` that includes localization methods.
*/
XT.DateTime = SC.DateTime.extend(
  /** @scope XT.DateTime.prototype */ {
  
  /**
    Returns the date portion of a `XT.DateTime object as a string, using 
    locale conventions
    
    @param {Boolean} long format - default false
  */
  toLocaleDateString: function(isLong) {
    var d = new Date(this.get('milliseconds')),
        format = isLong? 'D' : 'd',
        culture = XT.session.getPath('locale.culture');
    return Globalize.format(d, format, culture);
  },
  
  

});

// class methods
XT.DateTime.mixin( /** @scope XT.DateTime */ {

  parse: function(str, fmt) {
    // Declared as an object not a literal since in some browsers the literal
    // retains state across function calls
    var re = new RegExp('(?:%([aAbBcdDhHIjmMpSUWwxXyYZ%])|(.))', "g");
    var d, parts, opts = {}, check = {}, scanner = SC.Scanner.create({string: str});
    
    if (SC.none(fmt)) fmt = SC.DATETIME_ISO8601;
    
    try {
      while ((parts = re.exec(fmt)) !== null) {
        switch(parts[1]) {
          case 'a': check.dayOfWeek = scanner.scanArray(this.abbreviatedDayNames); break;
          case 'A': check.dayOfWeek = scanner.scanArray(this.dayNames); break;
          case 'b': opts.month = scanner.scanArray(this.abbreviatedMonthNames) + 1; break;
          case 'B': opts.month = scanner.scanArray(this.monthNames) + 1; break;
          case 'c': throw "%c is not implemented";
          case 'd':
          case 'D': opts.day = scanner.scanInt(1, 2); break;
          case 'h':
          case 'H': opts.hour = scanner.scanInt(1, 2); break;
          case 'I': opts.hour = scanner.scanInt(1, 2); break;
          case 'j': throw "%j is not implemented";
          case 'm': opts.month = scanner.scanInt(1, 2); break;
          case 'M': opts.minute = scanner.scanInt(1, 2); break;
          case 'p': opts.meridian = scanner.scanArray(['AM', 'PM']); break;
          case 'S': opts.second = scanner.scanInt(1, 2); break;
          case 'U': throw "%U is not implemented";
          case 'W': throw "%W is not implemented";
          case 'w': throw "%w is not implemented";
          case 'x': throw "%x is not implemented";
          case 'X': throw "%X is not implemented";
          case 'y': opts.year = scanner.scanInt(2); opts.year += (opts.year > 70 ? 1900 : 2000); break;
          case 'Y': opts.year = scanner.scanInt(4); break;
          case 'Z':
            var modifier = scanner.scan(1);
            if (modifier === 'Z') {
              opts.timezone = 0;
            } else if (modifier === '+' || modifier === '-' ) {
              var h = scanner.scanInt(2);
              if (scanner.scan(1) !== ':') scanner.scan(-1);
              var m = scanner.scanInt(2);
              opts.timezone = (modifier === '+' ? -1 : 1) * (h*60 + m);
            }
            break;
          case '%': scanner.skipString('%'); break;
          default:  scanner.skipString(parts[0]); break;
        }
      }
    } catch (e) {
      console.log('SC.DateTime.createFromString ' + e.toString());
      return null;
    }
    
    if (!SC.none(opts.meridian) && !SC.none(opts.hour)) {
      if (opts.meridian === 1) opts.hour = (opts.hour + 12) % 24;
      delete opts.meridian;
    }
    
    d = XT.DateTime.create(opts);
    
    if (!SC.none(check.dayOfWeek) && d.get('dayOfWeek') !== check.dayOfWeek) {
      return null;
    }
    
    return d;
  },
  
  /**
    returns XT.DateTime object set to '1971-01-01'
  */
  startOfTime: function() {
    return XT.DateTime.create(0);
  },
  
  /**
    returns XT.DateTime object set to '2100-01-01
  */
  endOfTime: function() {
    return XT.DateTime.parse('2100-01-01 00:00:00', '%Y-%m-%d %H:%M:%S');
  }
  
});