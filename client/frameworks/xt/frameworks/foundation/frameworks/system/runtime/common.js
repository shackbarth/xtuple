
/*globals XT */

/** @namespace

*/

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
