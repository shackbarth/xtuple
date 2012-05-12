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
    Related to (sibling).

		@static
		@constant
		@type String
		@default S
	*/
	PENDING: 'S',

	/**
		Parent.

		@static
		@constant
		@type String
		@default A
	*/
  DEFERRED: 'A',

	/**
    Child.
	
		@static
		@constant
    @type String
		@default C
	*/
   NEITHER: 'C',
	
	/**
    Duplicate.
	
		@static
		@constant
		@type String
		@default N
	*/
  DUPLICATE: 'D',

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
        if(this[key] && this[key].isRecordAttribute) {
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
			addDocuments = function() {
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
          if((status & SC.Record.DESTROYED) === 0 && idx === -1) {
            record.documents.push(childRec);
          }
        }
      };

      for(var i = 0; i < propsLength; i++) {
        documentAssignment = this.get(assignmentProperties[i]);
        documentAssignment.addObserver('[]', addDocuments);
      }
    }
  },

  //..................................................
  // OBSERVERS
  //
  

};
