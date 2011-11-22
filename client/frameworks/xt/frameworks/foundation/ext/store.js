
/*globals XT */

sc_require("mixins/logging");

/** @class

  @todo REVIEW ME REVIEW ME THIS WAS TAKEN FROM PROTOTYPE!!!

*/
XT.Store = SC.Store.extend(XT.Logging,
  /** @scope XT.Store.prototype */ {

  start: function() {
    this.log("Starting up");
    return YES;
  },

  name: "XT.Store",

   /**
  We commit changes in the opposite order that Sprout Core expects:
  first to the server, then to the parent store. So here we need to go
  through the motions of committing records the way Sprout Core expects
  so our committed records get to a clean state.
  */
  commitChangesFromNestedStore: function(nestedStore, changes, force) {
    var that = this, K = SC.Record, status,
    storeKeys = nestedStore.get('changelog');

    // process the first part normally
    sc_super();

    // clear record statuses by 'committing', even
    // though nothing is really happening on the
    // server at this point in our implementation
    this.commitRecords(null, null, storeKeys);
    storeKeys.forEach(function(storeKey) {
      that.dataSourceDidComplete(storeKey)
    })
  },

  // Metasql records have to be refreshed using parameters
  retrieveRecord: function(recordType, id, storeKey, isRefresh) {
    if(recordType &&
       (SC.kindOf(recordType, XM.Metasql))) {
      var params = new Object;
      params.id = id;

      var query = SC.Query.local(recordType, {
        parameters: params
      });

      XT.store.find(query);

      return YES;
    }

    return sc_super();
  }

});


// Adapted from:
// ==========================================================================
// Project:   More Cowbell -- https://github.com/erichocean/more_cowbell
// Copyright: ©2011 Erich Atlas Ocean.
// License:   Licensed under an MIT license (see license.js).
// ==========================================================================
/*global EO */

(function () {
  if (!SC || !SC.Store || !SC.NestedStore) return ;

    SC.NestedStore.prototype.error = null,

    SC.NestedStore.prototype.invalidRecords = [],

    SC.NestedStore.prototype.lockOnRead = NO,

    SC.Store.prototype.computeChangeset = function() {
      var nested    = this,
      sc_types  = SC.Set.create(),
      changeset = {sc_version: 1},
      K         = SC.Record,
      dataHash, recordName, status, id, includeHash, recordType;

      if (!nested.get('hasChanges')) return changeset;

      nested.changelog.forEach(function(storeKey){
        recordType  = nested.recordTypeFor(storeKey);
        recordName  = recordType.prototype.className;
        status      = nested.peekStatus(storeKey);
        id          = nested.idFor(storeKey).toString();
        includeHash = NO;
        sc_types.add(recordName);
        dataHash = nested.readDataHash(storeKey);

        if(!changeset[recordName]) {
          changeset[recordName] = {
            "created": [], "updated": [], "deleted": []
          };
        }

        if (status === K.READY_NEW) {
          changeset[recordName]['created'].push(dataHash);
          includeHash = YES;
        } else if (status & K.DESTROYED) {
          changeset[recordName]['deleted'].push(dataHash);
        } else if (status & K.DIRTY) {
          changeset[recordName]['updated'].push(dataHash);
          includeHash = YES;
        }

      });

      // fill in the changeset for 'store'
      changeset['sc_types'] = sc_types.toArray();
      return changeset ;
    };

    SC.Store.prototype.applyChangeset = function(changeset, storeKey) {
      var namespace = 'XT',
      store = this,
      recordTypes = changeset['sc_types'],
      recordType, typeChanges, datahashes, i;

      recordTypes.forEach(function(recordTypeName) {
        recordType = SC.objectForPropertyPath(namespace + '.' + recordTypeName);
        typeChanges = changeset[recordTypeName];
        if (!recordType) throw "Can't find object " + namespace + '.' + recordTypeName + " here";

        // loop over created and updated items and insert into store
        datahashes = typeChanges['created'];
        for(i=0; i < datahashes.length; i++) {
          store.loadRecord(recordType, datahashes[i]);
        };

        // TODO: merge what is already here, incase we are only given a diff
        datahashes = typeChanges['updated'];
        if (datahashes) {
          for(i=0; i < datahashes.length; i++) {
            store.loadRecord(recordType, datahashes[i]);
          };
        }

        // Now Delete any records that have been deleted
        datahashes = typeChanges['deleted'];
        if (datahashes) {
          for(i=0; i < datahashes.length; i++) {
            store.pushDestroy(recordType, datahashes[i].guid);
          };
        }
      })
    };
  })();
// END CONTRIBUTION BY ERICH OCEAN
