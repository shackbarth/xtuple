// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// =========================================================================
/*globals XM */

/** @mixin

  Support for document assignments on models.
  
*/

XM.Documents = {
  
  /**
  Holds all of the document assignments.
  */
  documents: [],
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  // .................................................
  // METHODS
  //
  
  initMixin: function() {
    var propertyArray = [];

    /**
      Build observers for document assignment properties 
    */
    propertyArray = this._xm_getAssignmentProperties();
    console.log(propertyArray);

  },

  /**
    Called to determine which properties are type XM.DocumentAssignment.
  */
  _xm_getAssignmentProperties: function() {
    if(!this._assignmentProperties) {
      var key, keyValue, keyValueType;

      this._assignmentProperties = [];
      for(key in this) {
        keyValue = this[key];
        if(keyValue && keyValue.isRecordAttribute) {
          keyValueType = this[key].type;
          if(SC.typeOf(keyValueType) === SC.T_STRING) {
            keyValueType = SC.objectForPropertyPath(keyValueType);
          }
          if(SC.kindOf(keyValueType, XM.DocumentAssignment)) {
            this._assignmentProperties.push(key);
          }
        }
      }

    }
    return this._assignmentProperties;
  },

  /**
    Called whenever the length of a document type array changes.
  */
  _xm_assignmentPropertyDidChange: function() {

  },

  //..................................................
  // OBSERVERS
  //
  

};
