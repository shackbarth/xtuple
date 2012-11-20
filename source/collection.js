/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    `XM.Collection` is a standard class for querying the xTuple data source.
    It should be sub classed for use with sub classes of `XM.Model` (which
    themselves typically exist in the `XM` name space). To create a new class,
    simply extened `XM.Collection` and indicate the model to reference:

      XM.MyCollection = XM.Collection.extend({
        model: XM.MyModel
      })

    Once your class is created you can intantiate one and call `fetch` to
    retreive all records of that type.

      var coll = new XM.MyCollection();
      coll.fetch();

    You can access the results on the `models` array.

      coll.models;

    You can specify options in fetch including `success` and `query` options.
    The `success` option is the callback executed when `fetch` sucessfully
    completes.

      var options = {
        success: function () {
          console.log('Fetch completed!')
        }
      };
      coll.fetch(options);

    Use a query object to limit the result set. This query will return results
    with the first name 'Frank' and last name 'Farley':

      var coll = new XM.ContactListItemCollection();
      var options = {
        query: {
          parameters":[{
           attribute:"firstName",
           value: "Mike"
          }, {
           attribute: "lastName",
           value: "Farley"
          }]
        }
      };
      coll.fetch(options);

    The `query` object supports the following:
      * parameters - Array of objects describing what to filter on.
        Supports the following properties:
        > attribute - The name of the attrbute to filter on
        > operator - The operator to perform comparison on.
        > value - The matching value.
        > includeNull - "OR" include the row if the attribute is null irrespective
          of whether the operator matches.
      * orderBy - Array of objects designating sort order. Supports
        the following properties:
        > attrbute - Attribute to sort by.
        > descending - `Boolean` value. If false or absent sort ascending.
      * rowLimit - Maximum rows to return
      * rowOffset - Result offset. Always use together with `orderBy`.

    If no operator is provided in a parameter object, the default will be `=`.
    Supported operators include:
      - `=`
      - `!=`
      - `<`
      - `<=`
      - `>`
      - `>=`
      - `BEGINS_WITH` -- (checks if a string starts with another one)
      - `ENDS_WITH` --   (checks if a string ends with another one)
      - `MATCHES` --     (checks if a string is matched by a case insensitive regexp)
      - `ANY` --         (checks if the thing on its left is contained in the array
                         on its right)

    Examples:

    Fetch the first 10 Contacts ordered by last name, then first name.

      var coll = new XM.ContactListItemCollection();
      var options = {
        query: {
          rowLimit: 10,
          orderBy: [{
            attribute: "lastName"
          }, {
            attribute: "firstName"
          }]
        }
      };
      coll.fetch(options);

    Fetch Contacts with 'Frank' in the name:

      var coll = new XM.ContactListItemCollection();
      var options = {
        query: {
          parameters:[{
            attribute: "name",
            operator: "MATCHES",
            value: "Frank"
          }],
        }
      };
      coll.fetch(options);

    Fetch Accounts in Virginia ordering by Contact name descending. Note
    support for querying object hierchary paths.

      var coll = new XM.AccountListItemCollection();
      var options = {
        query: {
          parameters:[{
            attribute: "primaryContact.address.state",
            value: "VA"
          }],
          orderBy: [{
            attribute: "primaryContact.name",
            descending: true
          }]
        }
      };
      coll.fetch(options);

    Fetch Items with numbers starting with 'B'.

      var coll = new XM.ItemListItemCollection();
      var options = {
        query: {
          parameters:[{
            attribute: "number",
            operator: "BEGINS_WITH",
            value: "B"
          }]
        }
      };
      coll.fetch(options);

    Fetch active To Do items due on or after July 17, 2009.

      var coll = new XM.ToDoListItemCollection();
      var dt = new Date();
      dt.setMonth(7);
      dt.setDate(17);
      dt.setYear(2009);
      var options = {
        query: {
          parameters:[{
            attribute:"dueDate",
            operator: ">=",
            value: dt
          }, {
            attribute: "isActive",
            value: true
          }]
        }
      };
      coll.fetch(options);

    Fetch contact(s) with an account number, account name, (contact) name,
    phone, or city matching 'ttoys' and a first name beginning with 'M'. Note
    an attribute array uses `OR` logic for comparison against all listed
    attributes.

      var coll = new XM.ContactListItemCollection();
      var options = {
        query: {
          parameters:[{
            attribute: ["account.number", "account.name", "name", "phone", "address.city"],
            operator: "MATCHES",
            value: "ttoys"
          }, {
            attribute: "firstName",
            operator: "BEGINS_WITH",
            value: "M"
          }]
        }
      };
      coll.fetch(options);

    @extends Backbone.Collection
  */
  XM.Collection = Backbone.Collection.extend(/** @lends XM.Collection# */{

    /**
      Handle status change.
    */
    add: function (models, options) {
      var result = Backbone.Collection.prototype.add.call(this, models, options),
        i,
        K = XM.Model;
      for (i = 0; i < result.models.length; i += 1) {
        result.models[i].setStatus(K.READY_CLEAN);
      }
      return result;
    },

    getObjectByName: function (name) {
      return Backbone.Relational.store.getObjectByName(name);
    },

    fetch: function (options) {
      //
      // Use default order attribute if it's specified and if no options are specified
      // TODO: we should apply the default ordering even in the presence of options
      // so long as the options don't have an orderBy command
      //
      options = options ? _.clone(options) :
        this.orderAttribute ? { query: this.orderAttribute } : {};
      options.force = true;
      /*
      var that = this,
        success = options.success;
      options.success = function (resp) {
        XT.log("Successfully fetched:" + that.model.prototype.recordType, resp);
        if (success) { success(resp); }
      };
      */
      return Backbone.Collection.prototype.fetch.call(this, options);
    },

    /**
      Sync to xTuple datasource.
    */
    sync: function (method, model, options) {
      options = options ? _.clone(options) : {};
      options.query = options.query || {};
      options.query.recordType = model.model.prototype.recordType;
      options.databaseType = model.model.prototype.databaseType;

      if (method === 'read' && options.query.recordType && options.success) {
        return XT.dataSource.fetch(options);
      }

      return false;
    },

    orderAttribute: null

  });

}());
