/*globals XT */

XT.hex = function() {
  var knowns = this._hex_values || [],
      hex;
  hex = (Math.random()*0xFFFFFF<<0).toString(16);
  if (knowns.indexOf(hex) >= 0) return XT.hex();
  knowns.push(hex);
  return hex;
};
