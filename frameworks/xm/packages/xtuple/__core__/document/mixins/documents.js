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
    var assignmentProperties = [],
        documentAssignment = [],
        record = this,
        arrayLength, key, keyValue, keyValueType;

      for(key in this) {
        keyValue = this[key];
        if(keyValue && keyValue.isRecordAttribute) {
          keyValueType = this[key].type;
          if(SC.typeOf(keyValueType) === SC.T_STRING) {
            keyValueType = SC.objectForPropertyPath(keyValueType);
          }
          if(SC.kindOf(keyValueType, XM.DocumentAssignment)) {
            assignmentProperties.push(key);
          }
        }
      }

    /**
      Build observers for XM.DocumentAssignment properties length
    */
    if(assignmentProperties.length) {
      arrayLength = assignmentProperties.length;
      for(var i = 0; i < arrayLength; i++) {
        documentAssignment = this.get(assignmentProperties[i]);
        documentAssignment.addObserver('[]', function() {
          
        });
      }
    }
  },

  /**
    Called whenever the length of an XM.DocumentAssignment property 
    type array changes.
  */
  _xm_assignmentPropertyDidChange: function() {
    var propertyArray = [],
        documentAssignment = [],
        arrayLength;

    propertyArray = this._xm_getAssignmentProperties();
    arrayLength = propertyArray.length;
    for(var i = 0; i < arrayLength; i++) {
      documentAssignment = this.get(propertyArray[i]);
      this.documents.concat(documentAssignment);
    }
  },

  //..................................................
  // OBSERVERS
  //
  

};
