

/**
  XT is the global namespace for all the "xTuple Tools" defined in
  lib/tools directory and elsewhere

  @namespace XT
 */
XT = typeof XT !== 'undefined' ? XT : {};

  /**
    @class XT.Foundation
    @name XT.Foundation
  */

_.extend(XT, /** @lends XT.Foundation# */{

  ASCII: {
    CARRIAGE_RETURN: 13,
    N_DASH: 45,
    ZERO: 48,
    NINE: 57,
    VULGAR_HALF: 189
  },

  // This will be updated from the server when we start our session
  debugging: false,

  _date: new Date(),

  toReadableTimestamp: function (millis) {
    var re = XT._date || (XT._date = new Date());
    re.setTime(millis);
    return re.toLocaleTimeString();
  },

  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
    });

    return uuid;
  },

  getObjectByName: function (target) {

    if (!target.split) return null;

    var parts = target.split(".");
    var ret;
    var part;
    var idx = 0;
    for (; idx < parts.length; ++idx) {
      part = parts[idx];
      ret = ret ? ret[part] : typeof window !== 'undefined' ? window[part] : global[part];
      //ret = ret? ret[part] : window[part];
      if (ret === null || ret === undefined) {
        return null;
      }
    }
    return ret;
  },

  /**
    @NOTE: some logic borrowed from SproutCore
  */
  A: function (obj) {
    if (obj === null || obj === undefined) return [];
    if (obj.slice instanceof Function) {
      if (typeof obj === "string") return [obj];
      else return obj.slice();
    }

    var ret = [];

    // case of function arguments that has length property
    if (obj.length) {
      var len = obj.length;
      while(--len >= 0) ret[len] = obj[len];
      return ret;
    }

    // for cases where we just convert the values from an
    // object to an array and discard the keys...
    return _.values(obj);
  }

});

XT.$A = XT.A;

