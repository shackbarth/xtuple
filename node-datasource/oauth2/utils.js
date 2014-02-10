/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */

var that = this;
/**
 * Return a universally unique identifier.
 *
 * We're using this solution:
 * http://stackoverflow.com/a/8809472/251019
 * From here:
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 *
 * @return {String}
 * @api private
 */
exports.generateUUID = function () {
  "use strict";

  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
    });

  return uuid;
};

/**
 * JSON Web Token (JWT) encode/decode helper functions.
 */
exports.base64urlUnescape = function (str) {
  "use strict";

  str += new Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
};

exports.base64urlDecode = function (str) {
  "use strict";

  return new Buffer(that.base64urlUnescape(str), 'base64').toString();
};

exports.base64urlEscape = function (str) {
  "use strict";

  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

exports.base64urlEncode = function (str) {
  "use strict";

  return that.base64urlEscape(new Buffer(str).toString('base64'));
};


/**
 * Retrun a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

exports.getRandomInt = function (min, max) {
  "use strict";

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
