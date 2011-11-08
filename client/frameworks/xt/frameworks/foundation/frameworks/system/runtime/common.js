
/*globals XT */

/** @namespace

*/


/** @property
  For blocking on tasks. Cannot be numeric due to
  restrictions on events that require them to be
  strings or regular expression.
*/
XT.WAIT_SIGNAL = "XTWAITSIGNAL";

XT.hex = function hex() {
  var knowns = this._hex_values || [],
      hex;
  hex = (Math.random()*0xFFFFFF<<0).toString(16);
  if(knowns.contains(hex)) return XT.hex();
  knowns.push(hex);
  return hex;
} ;

XT.keysFor = function keysFor(obj) {
  if(!obj || SC.typeOf(obj) !== SC.T_HASH)
    throw "Cannot find keys on non-object";
  var keys = [];
  for(var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    keys.push(key);
  }
  return keys;
} ;

XT.capitalize = function capitalize(str) {
  if(!str || SC.typeOf(str) !== SC.T_STRING)
    return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
