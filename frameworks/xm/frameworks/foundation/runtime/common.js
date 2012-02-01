/*globals XM */

XM.hex = function() {
  var knowns = this._hex_values || [],
      hex;
  hex = (Math.random()*0xFFFFFF<<0).toString(16);
  if (knowns.indexOf(hex) >= 0) return XM.hex();
  knowns.push(hex);
  return hex;
} ;

XM.keysFor = function keysFor(obj) {
  if (!obj || SC.typeOf(obj) !== SC.T_HASH) throw "Cannot find keys on non-object";
  var keys = [];
  for(var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    keys.push(key);
  }
  return keys;
} ;

XM.capitalize = function capitalize(str) {
  if (!str || SC.typeOf(str) !== SC.T_STRING) return str;
  else return str[0].toUpperCase() + str.slice(1).toLowerCase();
} ;

XM._collectAnimationEventsFor = function(fill) {
  var cvs = this.get("childViews"), i=0;
  if(!cvs || cvs.length <= 0) return;
  for(; i<cvs.length; ++i) {
    if(!cvs[i]) continue;
    if (!cvs[i]._xt_collectAnimationEvents) {
      XM._collectAnimationEventsFor.call(cvs[i], fill);
    } else cvs[i]._xt_collectAnimationEvents(fill);
  }
  if(this.xtAnimationEvents) {
    var keys = XM.keysFor(this.xtAnimationEvents);
    while(keys.length > 0) {
      var k = keys.shift();
      fill[k] = this;
    }
  }
} ;

XM._baseFrameBinding = function(target) {
  var bind;

  // if possible, reuse the binding so as not to create an
  // infinite number of them as plugins (or other?) are swapped
  // in and out
  if (target._basePaneFrameBinding && target._basePaneFrameBinding.isBinding) {
    bind = target._basePaneFrameBinding;
  } else {
    bind = SC.Binding
    .from("XM.BASE_PANE.frame")
    .to("_basePaneFrame", target)
    .oneWay();
  }
  bind
    .sync()
    .connect()
    .flushPendingChanges();
  return bind;
} ;
