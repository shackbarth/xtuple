// ==========================================================================
// Project:   XM.Record
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class XM.Record

  The XM.Record is an extension of the SC.Record class that adds
  xTuple-specific functionality. This includes both properties and
  methods.

  - Every record is expected to have an integer primary key called id.
™
  @version 0.1
*/
XM.Record = SC.Record.extend(
/** @scope XM.Record.prototype */ {

  /*
  The full path name of this class. Should be set in every subclass.
  
  @type string
  */
  className: 'XM.Record',
  
  /**
  The data type name. The same as the class name without the namespace.
  Used by nested records.
  
  @type string
  */
  type: SC.Record.attr(String, {
    defaultValue: function() {
      return arguments[0].get('className').replace((/\w+\./i),'');
    }
  }),

  /**
  The name of the privilege required to create this record type.
  */
  createPrivilege: null,

  /**
  The name of the privilege required to read this record type.
  */
  readPrivilege: null,

  /**
  The name of the privilege required to update this record type.
  */
  updatePrivilege: null,

  /**
  The name of the privilege required to delete this record type.
  */
  deletePrivilege: null,

  /**
  Indicates whether the record is in a valid state to be saved. Will be false if any
  errors exist in validateErrors.
  */
  isValid: function() {
    return this.getPath('validateErrors.length') === 0;
  }.property('validateErrorsLength'),

  /**
  An array of SC.Error objects populated by the validate function.
  */
  validateErrors: null,
  validateErrorsLength: 0,
  validateErrorsLengthBinding: '.validateErrors.length',
  
  /**
  State used for data source processing. You should never edit this directly.
  
  @property
  */
  dataState: SC.Record.attr(String, { 
    defaultValue: 'created' 
  }),
  
  // ..........................................................
  // METHODS
  //

  init: function() {
    this.set('validateErrors', []);
    if(this.getPath('store.isNested')) this.addObserver('isValid', this, '_isValidDidChange');
    arguments.callee.base.apply(this, arguments);
  },

  /**
  The validate function determines if there are any problems with the record that would cause
  it to be invalid and adds or subtracts errors found on the validateErrors array as
  appropriate and returns the array.

  The default implementation only returns the validateErrors array that is
  empty by default. Subclasses should implement this function to do real validaiton.
  Observers should be attached to properties that require validation, and the subclasses
  should use the updateErrors helper method:

    var errors = this.get('validateErrors');
    myErr = XM.errors.findProperty('code', 1234),
    myProperty = this.get('myProperty'),
    isError = (myProperty === null);

    this.upadteErrors(myErr, isError);

    return errors;

  Subclasses should pass errors defined and created in the XM.errors array to updateErrors.
  If an appropriate error code required by the subclass does not exist in XM.errors it
  should be added to the XM.errors definition file.

  */
  validate: function() {
    return this.get('validateErrors');
  },

  /**
  Convienience function for updating validateErrors list.
  Checks whether errors are in list before adding and removing
  to prevent duplicates.
  */
  updateErrors: function(error, isError) {
    var errors = this.get('validateErrors'),
    idx = errors.lastIndexOf(error);

    if(isError && idx === -1) errors.pushObject(error);
    else if(!isError && idx > -1) errors.removeAt(idx);
  },

  // ..........................................................
  // OBSERVERS
  //

  /** @private
  If the store is nested when this record is initialized, this function
  will be set to observe 'isValid' notify the store if the record becomes
  invalid.
  */
  _isValidDidChange: function() {
    var store = this.get('store'),
    invalidRecords = store.get('invalidRecords'),
    isValid = this.get('isValid'),
    idx = invalidRecords ? invalidRecords.lastIndexOf(this) : -1;

    if(store.get('isNested')) {
      if(isValid && idx > -1) invalidRecords.removeAt(idx);
      else if(!isValid && idx === -1) invalidRecords.pushObject(this);
    }
  },
  
  /** @private 
    Track substates for data source use. Updates dataState property directly 
    so we don't fire events that change the status to dirty.
  */
  _statusChanged: function() {
    var status = this.get('status'),
        key = 'dataState',
        value = 'error';

    if (status === SC.Record.READY_NEW)            value = 'created';
    else if (status === SC.Record.READY_CLEAN)     value = 'read';
    else if (status === SC.Record.DESTROYED_DIRTY) value = 'deleted';
    else if (status & SC.Record.DIRTY)             value = 'updated';

    if (status !== SC.Record.DESTROYED_CLEAN) {
      // You cannot write attributes once an object is fully destroyed.
      this.writeAttribute(key, value, YES);
    }
  }.observes('status')

});

/**
  Overload of `.extend()` to automatically call XM.Record.setup()
  on all extended XM.Record.constructors/subclasses
*/
XM.Record.extend = function() {
  var ret = SC.Object.extend.apply(this, arguments).setup();
  SC.Query._scq_didDefineRecordType(ret);
  return ret ;
};

/**
  Auto-executed from XM.Record.extend overloaded function. Features that need
  to be executed across all XM.Records but are dependent on the individual prototype
  need to happen here.
*/
XM.Record.setup = function() {

  // reference to `this` where `this` is a reference to the newly
  // created constructor (the return from SC.Record.extend)
  var self = this;

  // as an example of use, the prototype of `this` is the uninstanced
  // object constructor for the new XM.Record that was extended

  // this will create an entry for `guid` on the XM.Record that
  // defines the attribute as type String and adds a defaultValue
  // function that will return the correct type automatically
  this.prototype.guid = SC.Record.attr(String, {

  // this was held out of the previous call for clarity
  defaultValue: function() {

    // execute in the context of this record type since that is
    // how it determines what the class is
    return XM.Record.nextGuid.call(self.prototype);
  }});

  // return the original reference (!important)
  return this;
};

/**
Use this function to find out whether a user can create records before instantiating one.
*/
XM.Record.canCreate = function() {
  var createPrivilege = this.prototype.createPrivilege,
  result = NO;

  if(createPrivilege === null) return YES;

  if(XM.Session.privileges === null) return NO;

  if(SC.typeOf(createPrivilege) === SC.T_ARRAY) {
    createPrivilege.some(function(privilege) {
      result = XM.Session.privileges.get(privilege);
    });
  } else result = XM.Session.privileges.get(createPrivilege);

  return result;
};

/**
Use this function to find out whether a user can read this record type before any have been loaded.
*/
XM.Record.canRead = function() {
  var readPrivilege = this.prototype.readPrivilege,
      updatePrivilege = this.prototype.updatePrivilege,
      privileges = [], result = NO;

  if(readPrivilege === null  && updatePrivilege === null) return YES;

  if(XM.Session.privileges === null) return NO;

  // Push read privilege(s) into the array
  if(SC.typeOf(readPrivilege) === SC.T_ARRAY) {
    readPrivilege.forEach(function(privilege) {
      privileges.push(privilege);
    });
  } else privileges.push(readPrivilege);

  // Push update privilege(s) into the array
  if(SC.typeOf(updatePrivilege) === SC.T_ARRAY) {
    updatePrivilege.forEach(function(privilege) {
      privileges.push(privilege);
    });
  } else privileges.push(updatePrivilege);

  // Return YES if any privileges are true
  result = privileges.some(function(privilege) {
    return XM.Session.privileges.get(privilege);
  });

  return result;
};

/**
Returns whether a user has access to update this record type.
By default it is based on the updatePrivilege property. A record
instance may be passed in to check for row level privileges, however
the base class does not implement any row level checking. That
functionality must be implemented on subclasses as required.
*/
XM.Record.canUpdate = function(record) {
  var updatePrivilege = this.prototype.updatePrivilege,
  privileges = [], result = NO;

  if(updatePrivilege === null) return YES;

  if(XM.Session.privileges === null) return NO;

  // Push update privilege(s) into the array
  if(SC.typeOf(updatePrivilege) === SC.T_ARRAY) {
    updatePrivilege.forEach(function(privilege) {
      privileges.push(privilege);
    });
  } else privileges.push(updatePrivilege);

  // Return YES if any privileges are true
  result = privileges.some(function(privilege) {
    return XM.Session.privileges.get(privilege);
  });

  return result;
};

/**
Returns whether a user has access to delete this record type.
By default it is based on the updatePrivilege property. A record
instance may be passed in to check for row level privileges, however
the base class does not implement any row level checking. That
functionality must be implemented on subclasses as required.
*/
XM.Record.canDelete = function(record) {
  var deletePrivilege = this.prototype.deletePrivilege,
      privileges = [], result = NO;

  if(deletePrivilege === null) return YES;

  if(XM.Session.privileges === null) return NO;

  // Push delete privilege(s) into the array
  if(SC.typeOf(deletePrivilege) === SC.T_ARRAY) {
    deletePrivilege.forEach(function(privilege) {
      privileges.push(privilege);
    });
  } else privileges.push(updatePrivilege);

  // Return YES if any privileges are true
  result = privileges.some(function(privilege) {
    return XM.Session.privileges.get(privilege);
  });

  return result;
};

/**
  Wrapper for XM.Record.next to fetch the next NUMBER for a XM.Record type.
*/
XM.Record.nextNumber = function(numberType) {

  // grab the unambiguous class name
  var className = this.get("className");

  console.log("XM.Record.nextNumber for: %@".fmt(className));

  // execute the XM.Record.next method
  return XM.Record.next(className, "number", numberType);
};

/**
  Wrapper for XM.Record.next to fetch the next GUID for a XM.Record type.
*/
XM.Record.nextGuid = function() {

  // grab the classname
  var className = this.get("className");

  console.log("XM.Record.nextGuid for: %@".fmt(className));

  // execute the XM.Record.next method
  return XM.Record.next(className, "guid");
};

/**
  Called by XM.Record.nextGuid and XM.Record.nextNumber to acquire the next
  of those values for the record type. This method is not called directly, instead
  use `.nextGuid()` or `.nextNumber()` although this are typically called
  automatically.
*/
XM.Record.next = function() {

  // grab some of the data sent to us and setup the payload data object
  var recordClass = arguments[ 0 ];
  var field = arguments[ 1 ];
  var json = {
    name: "XM.NextFunctor",
    target: field,
    type: recordClass
  };
  
  // if the field is `number` then the payload is a little different
  if (field == "number") {

    // add the additional data field from the arguments object that
    // is the number-type to execute `fetchNextNumber`
    // if we don't have it, let the server handle the invalid data
    json[ "numberType" ] = arguments[ 2 ] || "";
  }

  //.............................................
  // TEMPORARILY EXECUTED SYNCHRONOUSLY

  // grab the response for the synchronous request for the next "guid"
  // of the record type

  // @note Not sure this will work with record-types where the guid is
  //    anything other than a valid integer
  var response = XM.Request.postUrl(
  
    // the URL should just be /retrieve/functor
    XM.DataSource.buildURL("functor")).header(
    
      // accept json encoded response, jsonify post data, as previously
      // noted execute synchronously
      { "Accept": "application/json" }).json().async(NO).send(

      // send the name of the functor it is requesting
      // the target that the functor will need
      // and the record class-type so it knows what sequence to use
      // or what number to pull, etc.
      json);

  // retrieve the response value
  var value = response.get("body").value;

  console.log("XM.Record.next: for %@ returned value: %@".fmt(recordClass, value));

  // regardless of what it is (worst case: null) return it
  return value;
};
