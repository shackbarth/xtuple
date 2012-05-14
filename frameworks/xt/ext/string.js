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
  @extends String
*/
// FIXME: Why doesn't this work?
String.prototype.loc = function() {
  if(!SC.Locale.currentLocale) { SC.Locale.createCurrentLocale(); }

  var localized = SC.Locale.currentLocale.locWithDefault(this);
  if (SC.typeOf(localized) !== SC.T_STRING) { localized = this; }

  return localized;
}

