/*jshint indent:2, curly:true,eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, console:true, Backbone: true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.CostCategory = XM.Document.extend(/** @lends XM.CostCategory.prototype */{

    recordType: 'XM.CostCategory',

    documentKey: "code"

  });

  /**
    @class

    @extends XM.Document
  */
  XM.PlannerCode = XM.Document.extend(/** @lends XM.PlannerCode.prototype */{

    recordType: 'XM.PlannerCode',

    documentKey: "code"

  });


  /**
    @class

    @extends XM.Model
  */
  XM.ItemSite = XM.Model.extend(/** @lends XM.ItemSite.prototype */{

    recordType: 'XM.ItemSite',

    name: function () {
      return this.getValue("item.number") + " " + this.getValue("site.code");
    },

    initialize: function () {
      // this.meta = new Backbone.Model();
      // this.meta("_itemSites", new XM.ItemSiteRelationCollection());
      XM.Model.prototype.initialize.apply(this, arguments);
    },

    defaults: function () {
      return {
        isActive: true,
        site: XT.defaultSite(),
        soldRanking: 1
      };
    },

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:item change:site', this.checkDuplicatePair);
      this.on('statusChange', this.statusDidChange);
    },

    /**
      We do not allow itemsites to be created with an item and a site that
      are already linked. Perform this validation asyncronously.

      @param {Function} callback The callback to be called when this function
        finishes. Pass a falsy value upon success and a truthy value upon error.
        Note that this function gets called with a different set of parameters
        if triggered by a binding, but we don't care about the params in that case.
     */
    checkDuplicatePair: function (callback) {
      var that = this;

      if (!this.get("item") || !this.get("site")) {
        // no need to check for duplicates unless both fields are set
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }
      var options = {},
        collection = new XM.ItemSiteCollection();

      options.success = function (resp) {
        var err, params = {};

        if (resp && resp.length > 0) {
          // validation fail. This pair already exists
          params.attr = "_item".loc() + " " + "_and".loc() + " " + "_site".loc();
          params.value = [that.getValue("item.number"), that.getValue("site.code")];
          params.response = resp;
          err = XT.Error.clone('xt1008', { params: params });
          that.trigger('invalid', that, err, options);
          if (typeof callback === 'function') {
            callback(err);
          }

        } else {
          if (typeof callback === 'function') {
            callback();
          }
        }
      };

      options.error = function (err) {
        console.log("Error searching for duplicate itemsite pair", err);
        if (typeof callback === 'function') {
          callback(true);
        }
      };

      options.query = {
        parameters: [{
          attribute: "item",
          value: this.get("item")
        }, {
          attribute: "site",
          value: this.get("site")
        }]
      };

      collection.fetch(options);
    },

    /**
      Perform the duplicate pair check before we try to save a new ItemSite
     */
    save: function (key, value, options) {
      var that = this;

      if (this.isNew()) {
        this.checkDuplicatePair(function (error) {
          if (!error) {
            XM.Model.prototype.save.call(that, key, value, options);
          }
        });
      } else {
        // edits to existing ItemSites don't need to go through the duplicate pair check
        XM.Model.prototype.save.call(this, key, value, options);
      }
    },

    statusDidChange: function () {
      var isReadOnly = this.getStatus() !== XM.Model.READY_NEW;
      this.setReadOnly(["item", "site"], isReadOnly);
    }

  });

  /**
    @class

    @extends XM.Comments
  */
  XM.ItemSiteComment = XM.Comment.extend(/** @lends XM.ItemSiteComment.prototype */{

    recordType: 'XM.ItemSiteComment',

    sourceName: 'IS'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteRelation = XM.Info.extend(/** @lends XM.ItemSiteRelation.prototype */{

    recordType: 'XM.ItemSiteRelation',

    editableModel: 'XM.ItemSite'

  });


  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteListItem = XM.Info.extend(/** @lends XM.ItemSiteListItem.prototype */{

    recordType: 'XM.ItemSiteListItem',

    editableModel: 'XM.ItemSite'

  });

  _.extend(XM.ItemSiteListItem, /** @lends XM.ItemSiteListItem# */{
    /**
      Item site has no searchable attributes by default, so we have to provide some, or
      errors occur (e.g. the search screen)
     */
    getSearchableAttributes: function () {
      return ["item.number", "site.code"];
    }
  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CostCategoryCollection = XM.Collection.extend(/** @lends XM.CostCategoryCollection.prototype */{

    model: XM.CostCategory

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PlannerCodeCollection = XM.Collection.extend(/** @lends XM.PlannerCodeCollection.prototype */{

    model: XM.PlannerCode

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteCollection = XM.Collection.extend(/** @lends XM.ItemSiteCollection.prototype */{

    model: XM.ItemSite

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteRelationCollection = XM.Collection.extend(/** @lends XM.ItemSiteRelationCollection.prototype */{

    model: XM.ItemSiteRelation,

    dispatch: true,

    comparator: function (itemSite) {
      var defaultSiteId = this.defaultSite ? this.defaultSite.id : -5;
      var defaultSiteOrder = itemSite.getValue("site.id") === defaultSiteId ? 'aa' : 'zz';
      return itemSite.getValue("item.number") + defaultSiteOrder + itemSite.getValue("site.code");
    }

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteListItemCollection = XM.Collection.extend(/** @lends XM.ItemSiteListItemCollection.prototype */{

    model: XM.ItemSiteListItem,

    dispatch: true

  });

}());
