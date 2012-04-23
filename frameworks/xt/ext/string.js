// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Localizes the string.  This will look up the receiver string as a key
  in the current Strings hash.  If the key matches, the loc'd value will be
  used.

  @returns {String} the localized string.
*/

String.prototype.loc = function() {
  if(!SC.Locale.currentLocale) { SC.Locale.createCurrentLocale(); }

  var localized = SC.Locale.currentLocale.locWithDefault(this);
  if (SC.typeOf(localized) !== SC.T_STRING) { localized = this; }

  return localized;
}

/**
  Accepts canvas 2D rendering context and maximum pixel length arguments and 
  returns a string that does not exceed the maximum width. If the original string 
  is too long for the width it will be truncated with elipses placed at the
  beginning of a text aligned right context or the end of a text aligned left
  or center context.

  @param {CanvasRenderingContext2D}  
  @param {Number) maximum length
*/
String.prototype.elide = function(context, maxLength) {
  var ret = this;
  if (context.measureText(ret).width > maxLength) {
    var e = '...', len = context.measureText(e).width;
    while (context.measureText(ret).width+len > maxLength) {
      ret = ret.slice(0, ret.length-1);
    }
    ret = context.textAlign === 'right'? e+ret : ret+e;
  }
  return ret;
}



