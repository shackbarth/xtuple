/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {

  "use strict";

  /**
    @class

    @extends XM.SalesOrderBase
  */
  XM.SalesOrder = XM.SalesOrderBase.extend(
    /** @lends XM.SalesOrder.prototype */{

    recordType: 'XM.SalesOrder',

    nameAttribute: 'number',

    numberPolicySetting: 'CONumberGeneration',

    documentDateKey: "orderDate",

    /**
      Add default for wasQuote.
     */
    defaults: function () {
      var defaults = XM.SalesOrderBase.prototype.defaults.apply(this, arguments);

      defaults.wasQuote = false;

      return defaults;
    },

    convertFromQuote: function (id) {
      var quote = new XM.Quote(),
        fetchOptions = {},
        that = this;
      // this id is the natural key, which is the number
      // for both sales order and quote
      fetchOptions.id = id;

      fetchOptions.success = function () {
        var expireDate = quote.get("expireDate"),
          obj,
          removeUuid = function (obj) {
            // If array loop through each and process
            if (_.isArray(obj)) {
              _.each(obj, function (item) {
                removeUuid(item);
              });
            // If object remove uuid, then process all properties
            } else if (_.isObject(obj)) {
              delete obj.uuid;
              _.each(obj, function (value) {
                // If array, dive down
                if (_.isArray(value)) {
                  removeUuid(value);
                }
              });
            }
          };

        if (expireDate < XT.date.today()) {
          that.trigger("invalid", XT.Error.clone(), that, {});
        }
        // TODO make sure customer is not prospect
        // TODO if cust on hold, check hold priv, CreateSOForHoldCustomer
        // TODO if cust on warn, check warn priv, CreateSOForWarnCustomer
        // TODO if uses po and not blanket po, check for dups
        // TODO if quote and so exist with this number, get another

        obj = quote.toJSON();
        obj.orderDate = XT.date.today();
        delete obj.quoteDate;
        delete obj.expireDate;
        obj.wasQuote = true;
        obj.quoteNumber = obj.number;
        removeUuid(obj);
        that.parse(obj);
        that.set(obj);
        that.off('change:customer', that.customerDidChange);
        that.fetchRelated("customer", {
          success: function () {
            that.on('change:customer', that.customerDidChange);
            that.revertStatus();
            that.checkConflicts = false;
          }
        });

        // TODO: Trigger on save that either closes or deletes quote
      };
      fetchOptions.error = function () {
        XT.log("Fetch failed in convertFromQuote");
      };
      this.setStatus(XM.Model.BUSY_FETCHING);
      quote.fetch(fetchOptions);
    },
  });

  XM.SalesOrder.used = function (id, options) {
    return XM.ModelMixin.dispatch('XM.SalesOrder', 'used',
      [id], options);
  };

  /**
    @class

    @extends XM.SalesOrderLineBase
  */
  XM.SalesOrderLine = XM.SalesOrderLineBase.extend(/** @lends XM.SalesOrderLine.prototype */{

    recordType: 'XM.SalesOrderLine',

    parentKey: 'salesOrder',

    lineCharacteristicRecordType: "XM.SalesOrderLineCharacteristic",

    /**
      Add defaults for firm, and subnumber.
     */
    defaults: function () {
      var defaults = XM.SalesOrderLineBase.prototype.defaults.apply(this, arguments);

      defaults.firm = false;
      defaults.subnumber = 0;

      return defaults;
    }
  });


  /**
    @class

    @extends XM.Comment
  */
  XM.SalesOrderComment = XM.Comment.extend(/** @lends XM.SalesOrderComment.prototype */{

    recordType: 'XM.SalesOrderComment',

    sourceName: 'S'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderAccount = XM.Model.extend(/** @lends XM.SalesOrderAccount.prototype */{

    recordType: 'XM.SalesOrderAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderContact = XM.Model.extend(/** @lends XM.SalesOrderContact.prototype */{

    recordType: 'XM.SalesOrderContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderFile = XM.Model.extend(/** @lends XM.SalesOrderFile.prototype */{

    recordType: 'XM.SalesOrderFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderItem = XM.Model.extend(/** @lends XM.SalesOrderItem.prototype */{

    recordType: 'XM.SalesOrderItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.SalesOrderLineCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.SalesOrderLineCharacteristic.prototype */{

    recordType: 'XM.SalesOrderLineCharacteristic',

    readOnlyAttributes: [
      "price"
    ]

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.SalesOrderLineComment = XM.Comment.extend(/** @lends XM.SalesOrderLineComment.prototype */{

    recordType: 'XM.SalesOrderLineComment',

    sourceName: 'SI'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.SalesOrderListItem = XM.Info.extend(/** @lends XM.SalesOrderListItem.prototype */{

    recordType: 'XM.SalesOrderListItem',

    editableModel: 'XM.SalesOrder'

  });

  XM.SalesOrderListItem = XM.SalesOrderListItem.extend(XM.SalesOrderBaseMixin);

  /**
    @class

    @extends XM.Info
  */
  XM.SalesOrderRelation = XM.Info.extend(/** @lends XM.SalesOrderRelation.prototype */{

    recordType: 'XM.SalesOrderRelation',

    editableModel: 'XM.SalesOrder',

    descriptionKey: "number"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderUrl = XM.Model.extend(/** @lends XM.SalesOrderUrl.prototype */{

    recordType: 'XM.SalesOrderUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderProject = XM.Model.extend(/** @lends XM.SalesOrderProject.prototype */{

    recordType: 'XM.SalesOrderProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderIncident = XM.Model.extend(/** @lends XM.SalesOrderIncident.prototype */{

    recordType: 'XM.SalesOrderIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderOpportunity = XM.Model.extend(/** @lends XM.SalesOrderOpportunity.prototype */{

    recordType: 'XM.SalesOrderOpportunity',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderCustomer = XM.Model.extend(/** @lends XM.SalesOrderCustomer.prototype */{

    recordType: 'XM.SalesOrderCustomer',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderToDo = XM.Model.extend(/* @lends XM.SalesOrderToDo */{

    recordType: 'XM.SalesOrderToDo',

    isDocumentAssignment: true

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderListItemCollection = XM.Collection.extend(/** @lends XM.SalesOrderListItemCollection.prototype */{

    model: XM.SalesOrderListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderRelationCollection = XM.Collection.extend(/** @lends XM.SalesOrderRelationCollection.prototype */{

    model: XM.SalesOrderRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderLineCollection = XM.Collection.extend(/** @lends XM.SalesOrderLineCollection.prototype */{

    model: XM.SalesOrderLine

  });

}());
