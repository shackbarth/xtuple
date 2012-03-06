select xt.install_js('XM','Contact','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Contact = {};

  XM.Contact.isDispatchable = true,

  /** 
  Returns the address id of an address found that matches the arguments.

  @param {Object} Address object
  @returns {Boolean}
  */
  
  XM.Contact.merge = function(sourceContactId,targetContactId,purge) {

	/**
	 Merge contacts

	 @param {number,number,boolean}
	 @returns {boolean} 
  */
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("MergeContacts")) err = "Access denied."
	  else if(sourceContactId === undefined) err = "Not defined";
	  else if(targetContactId === undefined) err = "Not defined";
	  else if(purge === undefined) err = "Not defined";

	  if(!err) {

			ret = executeSql("select cntctmerge($1,$2,$3) AS result;", [sourceContactId,targetContactId,purge])[0].result;

			return ret;
	  }

	  throw new Error(err);
		}
  }

	XM.Contact.used = function(contactId) {

	/**
	 Used contacts

	 @param {number}
	 @returns {boolean} 
  */
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("MergeContacts")) err = "Access denied."
	  else if(contactId === undefined) err = "Not defined";

	  if(!err) {

			ret = executeSql("select cntctused($1) AS result;", [contactId])[0].result;

			return ret;
	  }

	  throw new Error(err);
		}
  }
	
	XM.Contact.restore = function(mergeContactId) {

	/**
	 Restore contacts

	 @param {number}
	 @returns {boolean} 
  */
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("MergeContacts")) err = "Access denied."
	  else if(mergeContactId === undefined) err = "Not defined";

	  if(!err) {

			ret = executeSql("select cntctrestore($1) AS result;", [mergeContactId])[0].result;

			return ret;
	  }

	  throw new Error(err);
		}
  }
$$ );

