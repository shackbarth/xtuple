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
  
  @type String
  */
  className: 'XM.Record',
  
  /**
  The data type name. The same as the class name without the namespace.
  Used by nested records.
  
  @type String
  */
  type: SC.Record.attr(String, {
    defaultValue: function() {
      return arguments[0].get('className').replace((/\w+\./i),'');
    }
  }),
  
  /**
    A property that returns the result of canUpdate.
    
    @type Boolean
  */
  isEditable: function() {
    var isEditable = arguments.callee.base.apply(this, arguments) 
    if(isEditable && this.get('status') !== SC.Record.READY_NEW) return this.canUpdate();
    return isEditable;
  }.property('status').cacheable(),

  /**
  A hash structure that defines data access.
  
  @property
  @type Hash
  */
  privileges: null,
  
  /**
  Indicates whether the record is in a valid state to be saved. Will be false if any
  errors exist in validateErrors.
  
  @property
  @type Boolean
  */
  isValid: function() {
    return this.getPath('validateErrors.length') === 0;
  }.property('validateErrorsLength'),

  /**
  An array of SC.Error objects populated by the validate function.
  */
  validateErrors: null,
  validateErrorsLength: 0,
  validateErrorsLengthBinding: SC.Binding.from('.validateErrors.length').noDelay(),
  
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
    arguments.callee.base.apply(this, arguments);
    this.set('validateErrors', []);
    if(this.getPath('store.isNested')) this.addObserver('isValid', this, '_isValidDidChange');
  },
  
  /**
    Returns whether the record has an original data cache retrieved from the 
    data source.
    
    @returns Boolean
  */
  isCached: function() {
    var storeKey = this.get('storeKey'),
        store = this.get('store');
    return store._xm_dataCaches && store._xm_dataCaches[storeKey] ? true : false;
  },
  
  /**
    Return the original cached property value for records retreived from
    the datasource.
    
    @param {String} property
    @returns Any
  */
  getCache: function(key) {
    var storeKey = this.get('storeKey'),
        store = this.get('store');
    return store._xm_dataCaches ? store._xm_dataCaches[storeKey][key] : null;
  },
  
  /**
    Returns whether the current record can be updated based on privilege settings.
    
    @returns Boolean
  */
  canUpdate: function() {
    var recordType = this.get('store').recordTypeFor(this.get('storeKey')),
        status = this.get('status');
    
    return status & SC.Record.READY && recordType.canUpdate(this);
  },

  /**
    Returns whether the current record can be deleted based on privilege settings.
    
    @returns Boolean
  */  
  canDelete: function() {
    var recordType = this.get('store').recordTypeFor(this.get('storeKey')),
        status = this.get('status');
    
    return status & SC.Record.READY && recordType.canDelete(this);
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
  _xm_isValidDidChange: function() {
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
  _xm_statusChanged: function() {
    var status = this.get('status'),
        key = 'dataState',
        value = 'error';
    
    // update data state used for server side evaluation
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

  if(this.prototype.primaryKey === 'guid') {
    this.prototype.guid = SC.Record.attr(String, {

      defaultValue: function () {
        if(arguments[0]) XM.Record.fetchId.call(arguments[0]);
      }
    })
  }

  // return the original reference (!important)
  return this;
};

/**
Use this function to find out whether a user can create records before instantiating one.
*/
XM.Record.canCreate = function() {
  var privileges = this.prototype.privileges,
      sessionPrivs = XM.session.privileges,
      isGranted = false;
      
  if(sessionPrivs) {
    isGranted = privileges.all && privileges.all.create && sessionPrivs.get(privileges.all.create) ? true : 
               (privileges.personal && privileges.personal.create && sessionPrivs.get(privileges.personal.create) ? true : false);
  
  }

  return isGranted;
};

/**
Use this function to find out whether a user can read this record type before any have been loaded.
*/
XM.Record.canRead = function() {
  var privileges = this.prototype.privileges,
      sessionPrivs = XM.session.privileges,
      isGranted = false;
      
  if(sessionPrivs) {
    isGranted = privileges.all && privileges.all.read && sessionPrivs.get(privileges.all.read) ? true : 
               (privileges.all && privileges.all.update && sessionPrivs.get(privileges.all.update) ? true :
               (privileges.personal && privileges.personal.read && sessionPrivs.get(privileges.personal.read) ? true :
               (privileges.personal && privileges.personal.update && sessionPrivs.get(privileges.personal.update) ? true : false)));
  
  }

  return isGranted;
};

/**
Returns whether a user has access to update a record of this type. If a record is passed that involves
personal privileges, it will validate whether that particular record is updatable.
*/
XM.Record.canUpdate = function(record) {
  return XM.Record._canDo.call(this, 'update', record);
};

/**
Returns whether a user has access to delete a record of this type. If a record is passed that involves
personal privileges, it will validate whether that particular record is deletable.
*/
XM.Record.canDelete = function(record) {
  return XM.Record._canDo.call(this, 'delete', record);
};

/** @private */
XM.Record._canDo = function(action, record) {
  var privileges = this.prototype.privileges,
      sessionPrivs = XM.session.privileges,
      isGrantedAll = false,
      isGrantedPersonal = false,
      userName = XM.DataSource.session.userName;

  if(sessionPrivs) {
    isGrantedAll = privileges.all && privileges.all[action] ? sessionPrivs.get(privileges.all[action]) : false;
               
    isGrantedPersonal = isGrantedAll ? true : 
                       (privileges.personal && privileges.personal[action] ? sessionPrivs.get(privileges.personal[action]) : false);
  
  }
  
  // if only personal privileges, check the original attribute cache to see if this was it was updatable
  if(!isGrantedAll && isGrantedPersonal && record && this._attrCache) {
    var i = 0, props = privileges.personal && privileges.personal.properties ? privileges.personal.properties : [];
    
    isGrantedPersonal = false;
    while(!isGrantedPersonal && i < props.length) {
      isGrantedPersonal = this._attrCache[prop[i]] === XM.DataSource.session.userName;
      i++;
    }
  }

  return isGrantedAll || isGrantedPersonal;
};

/**
  A utility function to sets the next sequential id on a record. 
  Accepts a number property to set when the server responds. 
  
  The function will send the class name property of itself to the server
  which will cross reference the ORM 'idSequnceName' property for the class 
  to determine which sequence to use.
  
  @param {String} id property to set, defaults to 'guid'
  @returns {Object} receiever
*/
XM.Record.fetchId = function(prop) {
  var self = this,
      prop = prop ? prop : 'guid',
      recordType = this.get("className"),
      dispatch;
  
  callback = function(error, result) {
    if(!error) self.set(prop, result);
  }
  
  dispatch = XM.Dispatch.create({
    className: 'XT.Record',
    functionName: 'fetchId',
    parameters: recordType,
    target: self,
    action: callback
  });

  console.log("XM.Record.fetchId for: %@".fmt(recordType));

  self.get('store').dispatch(dispatch);
  
  return this;
};

/**
  A utility function to sets the next sequential number on a record. 
  Accepts a number property to set when the server responds. 
  
  The function will send the class name property of itself to the server
  which will cross reference the ORM 'orderSequnce' property for the class 
  to determine which sequence to use.
  
  @param {String} number property to set, defaults to 'number'
  @returns {Object} receiever
*/
XM.Record.fetchNumber = function(prop) {
  var self = this,
      prop = prop ? prop : 'number',
      recordType = this.get("className"),
      dispatch;
  
  callback = function(error, result) {
    if(!error) {
      self._numberGen = result;
      self.set(prop, result);
    };
  }
  
  dispatch = XM.Dispatch.create({
    className: 'XT.Record',
    functionName: 'fetchNumber',
    parameters: recordType,
    target: self,
    action: callback
  });

  console.log("XM.Record.fetchNumber for: %@".fmt(recordType));

  self.get('store').dispatch(dispatch);
  
  return this;
};

/**
  Releases a number back into the number pool for the record type. Usually
  would happen when user cancels without saving a new record. 
  
  The function will send the class name property of itself to the server
  which will cross reference the ORM 'orderSequnce' property for the class 
  to determine which sequence to use.
  
  @param {Number} number to release
  @returns {Object} receiever
*/
XM.Record.releaseNumber = function(number) {
  var self = this,
      recordType = this.get("className"),
      dispatch;

  dispatch = XM.Dispatch.create({
    className: 'XT.Record',
    functionName: 'releaseNumber',
    parameters: [
      recordType,
      number
    ],
    target: self
  });

  console.log("XM.Record.releaseNumber for: %@".fmt(recordType));

  self.get('store').dispatch(dispatch);
  
  return this;
};

/**
   Return a matching record id for a passed user key and value. 
   If none found returns zero.
  
    @param {String} property to search on, typically a user key
    @param {String} value to search for
    @param {Function} callback
  @returns {Object} receiever
*/
XM.Record.findExisting = function(key, value, callback) {
  var self = this,
      recordType = this.get("className"),
      dispatch;

  dispatch = XM.Dispatch.create({
    className: 'XT.Record',
    functionName: 'findExisting',
    parameters: [
      recordType,
      key,
      value
    ],
    target: self,
    action: callback
  });

  console.log("XM.Record.findExisting for: %@".fmt(recordType));

  self.get('store').dispatch(dispatch);
  
  return this;
};




