// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record

*/

XM.Address = XM.Record.extend( SC.Copyable,
/** @scope XM.Address.prototype */ {

  className:   'XM.Address',

  createPrivilege:  'MaintainAddresses',
  readPrivilege:    'ViewAddresses',
  updatePrivilege:  'MaintainAddresses',
  deletePrivilege:  'MaintainAddresses',

  /*
  @type String
  */
  number:     SC.Record.attr(String, {
    isRequired: YES,
    defaultValue: function () {
      return arguments[ 0 ].get("status") === SC.Record.READY_NEW
        ? XM.Record.nextNumber.call(arguments[ 0 ], "AddressNumber")
        : null
        ;
    }
  }),
  
  /**
  @type String
  */
  line1:      SC.Record.attr(String),
  
  /**
  @type String
  */
  line2:      SC.Record.attr(String),
  
  /**
  @type String
  */
  line3:      SC.Record.attr(String),
  
  /**
  @type String
  */
  city:	      SC.Record.attr(String),
  
  /**
  @type String
  */
  state:      SC.Record.attr(String),
  
  /**
  @type String
  */
  postalcode: SC.Record.attr(String),
  
  /**
  @type String
  */
  country:    SC.Record.attr(String, {
    defaultValue: function() {
      var country = XT.Session.metrics.get('DefaultAddressCountry');
      return country ? country : null;
    }
  }),
  
  /**
  @type String
  */
  notes:      SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  isActive:   SC.Record.attr(Boolean, {
    defaultValue: YES
  }),
  
  /**
  @type XM.CharactersticAssignment
  */
  characteristics: SC.Record.toMany('XM.CharacteristicAssignment', {
    inverse: 'address',
  }),
  
  /**
  @type XM.AddressComment
  */
  comments: XM.Record.toMany('XM.AddressComment', {
    inverse: 'address',
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
  false;

  @return {Number} id of an existing address
*/
XM.Address.findExisting = function(address) {
  // Validate argument
  if(!SC.kindOf(address, XM.Address)) return NO;

  var params = new Object;
  params.line1 = address.get('line1');
  params.line2 = address.get('line2');
  params.line3 = address.get('line3');
  params.city = address.get('city');
  params.state = address.get('state');
  params.postalcode = address.get('postalcode');
  params.country = address.get('country');

  var response = SC.Request.postUrl(XM.DataSource.buildURL('metasql','XM.Address', 'findExisting'))
  .header({ 'Accept': 'application/json' }).json().async(NO).send(params);

  if (SC.ok(response) && response.get('body').content !== false) {
    return response.get('body').content[0].result ? response.get('body').content[0].result : NO;
  } else return NO;

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
  Returns an integer from the server indicating how many times the address is used by other records.

  @return {Number}
*/
XM.Address.useCount = function(address) {
  if(!SC.kindOf(address, XM.Address)) return NO;

  var params = new Object;
  params.id = address.get('id');

  if(params.id === undefined) return NO;

  var response = SC.Request.postUrl(XT.DataSource.buildURL('metasql','XM.Address', 'useCount'))
  .header({ 'Accept': 'application/json' }).json().async(NO).send(params);

  if (SC.ok(response) && response.get('body').content !== false) {
    return response.get('body').content[0].result ? response.get('body').content[0].result : 0;
  }
  else return 0;
};

