// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/_address');

/**
  (Document your Model here)

  @extends XM.Document
  @extends SC.Copyable
*/

XM.Address = XM.Document.extend(XM._Address, SC.Copyable,
/** @scope XM.Address.prototype */ {
  
  numberPolicy: XM.AUTO_NUMBER,
  
  /**
  @type String
  */
  country: SC.Record.attr(String, {
    defaultValue: function() {
      var country = XM.session.settings.get('DefaultAddressCountry');
      return country ? country : null;
    }
  }),
  
  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: YES
  }),

  // ..........................................................
  // METHODS
  //

  /**
    A utility function to copy the address.

    @param {XM.Address} address
    @return {XM.Address} copy of the receiver
  */
  copy: function() { return XM.Address.copy(this) },

  /**
    This function formats the multiple lines of an address into a
    text block separating the elements of the address by line breaks.

    @param {isHtml} Optional. Specify whether line breaks are to be HTML
    @return {String}
  */
  format: function(isHtml) { return XM.Address.format(this, isHtml ? isHtml : NO) },

  /**
    Returns an integer from the server indicating how many times the address is used by other
    records.

    @return {Number}
  */
  useCount: function() { return XM.Address.useCount(this) }

});

/**
  A utility function to copy an address.

  @param {XM.Address} address
  @return {XM.Address} copy of the address
*/
XM.Address.copy = function(address) {
  if(!SC.kindOf(address, XM.Address)) return NO;

  var store = address.get('store'),
  hash = address.get('attributes');

  delete hash.guid;
  delete hash.number;
  delete hash.notes;

  return store.createRecord(XM.Address, hash).normalize();
}

/**
  Find an address with the same fields as the passed. Only
  works if the record is in READY_NEW status, otherwise returns
  false.

  @param {XM.Address} and address to query for a matchon
  @param {function} callback to receive the result
  @return receiver
*/
XM.Address.findExisting = function(address, callback) {
  if(!SC.kindOf(address, XM.Address) || 
     address.get('status') !== SC.Record.READY_NEW) return NO;

  var dispatch = XM.Dispatch.create({
    className: 'XM.Address',
    functionName: 'findExisting',
    parameters: {
      type: address.get('type'),
      line1: address.get('line1'),
      line2: address.get('line2'),
      line3: address.get('line3'),
      city: address.get('city'),
      state: address.get('state'),
      postalcode: address.get('postalcode'),
      country: address.get('country')
    },
    action: callback
  })

  console.log("XM.Address.findExisting for: %@".fmt(JSON.stringify(address.get('attributes'))));

  address.get('store').dispatch(dispatch);
};

/**
  This function formats the multiple lines of an address into a
  text block separating the elements of the address by line breaks.

  Address format accepts multiple argument formats:
    XM.Address.format(address);
    XM.Address.format(address, isHtml);
    XM.Address.format(name, line1, line2, line3, city, state, postalcode, country);
    XM.Address.format(name, line1, line2, line3, city, state, postalcode, country, isHtml);

  Where address is an XM.Address and isHtml determines whether to
  use HTML line breaks instead of ASCII new line characters. The
  default for isHtml is NO. The longer signatures accept string
  components of an address.

  @return {String}
*/
XM.Address.format = function() {
  var fmtlines   = [],
  name, line1, line2, line3,
  city, state, postalcode,
  breaks, result = '';

  if(SC.kindOf(arguments[0], XM.Address)) {
    name = '';
    line1 = arguments[0].get('line1');
    line2 = arguments[0].get('line2');
    line3 = arguments[0].get('line3');
    city = arguments[0].get('city');
    state = arguments[0].get('state');
    postalcode = arguments[0].get('postalcode');
    country = arguments[0].get('country');
    breaks = (arguments[1] === undefined ? NO : arguments[1]) ? '<br />' : '\n';
  }
  else if(typeof arguments[0] === SC.T_STRING)  {
    name = arguments[0];
    line1 = arguments[1];
    line2 = arguments[2];
    line3 = arguments[3];
    city = arguments[4];
    state = arguments[5];
    postalcode = arguments[6];
    country = arguments[7];
    breaks = (arguments[8] === undefined ? NO : arguments[8]) ? '<br />' : '\n';
  }
  else return NO;

  if(name) fmtlines.push(name);
  if(line1) fmtlines.push(line1);
  if(line2) fmtlines.push(line2);
  if(line3) fmtlines.push(line3);
  if(city || state || postalcode) {
    fmtlines.push('%@%@%@%@%@'.fmt(city ? city  : '',
                                   city && (state || postalcode) ? ', '  : '',
                                   state ? state : '',
                                   state && postalcode ? ' '  : '',
                                   postalcode ? postalcode : ''));
  }
  if (country) fmtlines.push(country);

  if (fmtlines.length) result = fmtlines.join(breaks);

  return result;
};

/**
  Returns an integer from the server indicating how many times the address is used 
  by other records.

  @param {XM.Address} and address to query use count on
  @param {function} callback to receive the result
  @return receiver
*/
XM.Address.useCount = function(address, callback) {
  if(!SC.kindOf(address, XM.Address)) return NO;

  var dispatch = XM.Dispatch.create({
    className: 'XM.Address',
    functionName: 'useCount',
    parameters: address.get('id'),
    action: callback
  })

  console.log("XM.Address.useCount for: %@".fmt(address.get('id')));

  address.get('store').dispatch(dispatch);
  
  return this;
};

