// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Localizes the string.  This will look up the receiver string as a key
  in the current Strings hash.  If the key matches, the loc'd value will be
  used.  The resulting string will also be passed through fmt() to insert
  any variables.

  @param args {Object...} optional arguments to interpolate also
  @returns {String} the localized and formatted string.
*/

String.prototype.loc = function() {
  if(!SC.Locale.currentLocale) { SC.Locale.createCurrentLocale(); }

  var localized = SC.Locale.currentLocale.locWithDefault(this);
  if (SC.typeOf(localized) !== SC.T_STRING) { localized = this; }

  var args = SC.$A(arguments);
  //to extend String.prototype
  if(args.length>0 && args[0].isSCArray) args=args[0];

  return localized.fmt(args);
}



