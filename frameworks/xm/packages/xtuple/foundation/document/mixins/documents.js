// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// =========================================================================
/*globals XM */

/** @namespace

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
        propsLength, key, keyValue, keyValueType;

      /**
        Loop through object properties and build array
        of type XM.DocumentAssignment.
      */
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
      Build observers for XM.DocumentAssignment property
      arrays.
    */
    if(assignmentProperties.length) {
      propsLength = assignmentProperties.length;
      for(var i = 0; i < propsLength; i++) {
        documentAssignment = this.get(assignmentProperties[i]);
        documentAssignment.addObserver('[]', function() {
          var docAssLength = this.get('length'),
              docs = record.documents,
              childRec, indx, status;

          /**
            Loop through child records and add any 
            non-DESTROYED records (that don't already exist)
            to documents[].
          */
          for(var j = 0; j < docAssLength; j++) {
            childRec = this.objectAt(j);
            idx = docs.lastIndexOf(childRec);
            status = childRec.get('status');
            if((status & SC.Record.DESTROYED) == 0 && idx === -1) {
              record.documents.push(childRec);
            }
          }
        });
      }
    }
  },

  //..................................................
  // OBSERVERS
  //
  

};
