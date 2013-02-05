/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Prospect = XM.AccountDocument.extend({
    /** @scope XM.Prospect.prototype */

    recordType: 'XM.Prospect',

    defaults: {
      isActive: true
    },

    requiredAttributes: [
      "isActive"
    ],
    
    // ..........................................................
    // METHODS
    //
    
    /**
      Creates a new account model and fetches based on the given ID.
      Takes attributes from the account model and gives them to this customer model.
    */
    convertFromAccount: function (id) {
      var account = new XM.Account(),
          fetchOptions = {},
          that = this;
          
      fetchOptions.id = id;
      
      fetchOptions.success = function (resp) {
        that.set("name", account.get("name"));
        that.set("Contact", account.get("primaryContact"));
        that.revertStatus();
        that._number = that.get('number');
      };
      fetchOptions.error = function (resp) {
        XT.log("Fetch failed in convertFromAccount");
      };
      this.setStatus(XM.Model.BUSY_FETCHING);
      account.fetch(fetchOptions);
    }

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ProspectRelation = XM.Info.extend({
    /** @scope XM.ProspectRelation.prototype */

    recordType: 'XM.ProspectRelation',

    editableModel: 'XM.Prospect',

    descriptionKey: "name"

  });


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ProspectRelationCollection = XM.Collection.extend({
    /** @scope XM.ProspectRelationCollection.prototype */

    model: XM.ProspectRelation

  });

}());
