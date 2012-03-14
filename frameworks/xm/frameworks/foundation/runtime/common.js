/*globals XM */

XM.hex = function() {
  var knowns = this._hex_values || [],
      hex;
  hex = (Math.random()*0xFFFFFF<<0).toString(16);
  if (knowns.indexOf(hex) >= 0) return XM.hex();
  knowns.push(hex);
  return hex;
} ;

