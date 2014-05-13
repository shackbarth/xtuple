/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class `XM.Collection` is a standard class for querying the xTuple data source.
    It should be subclassed for use with subclasses of `XM.Model` (which
    themselves typically exist in the `XM` namespace). To create a new class,
    simply extend `XM.Collection` and indicate the model to reference:
    <pre><code>
      XM.MyCollection = XM.Collection.extend({
        model: XM.MyModel
      })
    </code></pre>
    After your class is created, you can instantiate one and call `fetch` to
    retrieve all records of that type.
    <pre><code>
      var coll = new XM.MyCollection();
      coll.fetch();
    </code></pre>
    You can access the results on the `models` array.
    <pre><code>
      coll.models;
    </code></pre>
    You can specify options in fetch including `success` and `query` options.
    The `success` option is the callback executed when `fetch` sucessfully
    completes.
    <pre><code>
      var options = {
        success: function () {
          console.log('Fetch completed!')
        }
      };
      coll.fetch(options);
    </code></pre>
    Use a query object to limit the result set. For example, this query will return results
    with the first name 'Frank' and last name 'Farley':
    <pre><code>
      var coll = new XM.ContactListItemCollection();
      var options = {
        query: {
          parameters: [{
            attribute: "firstName",
            value: "Mike"
          }, {
            attribute: "lastName",
            value: "Farley"
          }]
        }
      };
      coll.fetch(options);
    </code></pre>
    The `query` object supports the following:<pre>
      &#42; parameters - Array of objects describing what to filter on.
        Supports the following properties:
        > attribute - The name of the attribute to filter on.
        > operator - The operator to perform comparison on.
        > value - The matching value.
        > includeNull - "OR" include the row if the attribute is null irrespective
          of whether the operator matches.
      &#42; orderBy - Array of objects designating sort order. Supports
        the following properties:
        > attribute - Attribute to sort by.
        > descending - `Boolean` value. If false or absent sort ascending.
      &#42; rowLimit - Maximum rows to return.
      &#42; rowOffset - Result offset. Always use together with `orderBy`.
    </pre>
    If no operator is provided in a parameter object, the default will be `=`.
    Supported operators include:<pre>
      - `=`
      - `!=`
      - `<`
      - `<=`
      - `>`
      - `>=`
      - `BEGINS_WITH` -- (checks if a string starts with another one)
      - `ENDS_WITH` --   (checks if a string ends with another one)
      - `MATCHES` --     (checks if a string is matched by a case insensitive regexp)
      - `ANY` --         (checks if the number or text on the left is contained in the array
                         on the right)
      - `NOT ANY` --     (checks if the number or text on the left is not contained in the array
                        on the right)</pre>
    <h5>Examples</h5>
    Example: Fetch the first 10 Contacts ordered by last name, then first name.
    <pre><code>
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
    </code></pre>
    Example: Fetch Contacts with 'Frank' in the name.
    <pre><code>
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
    </code></pre>
    Example: Fetch Accounts in Virginia ordering by Contact name descending. Note
    support for querying object hierarchy paths.
    <pre><code>
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
    </code></pre>
    Example: Fetch Items with numbers starting with 'B'.
    <pre><code>
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
    </code></pre>
    Example: Fetch active To Do items due on or after July 17, 2009.
    <pre><code>
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
    </code></pre>
    Example: Fetch contact(s) with an account number, account name, (contact) name,
    phone, or city matching 'ttoys' and a first name beginning with 'M'. Note
    an attribute array uses `OR` logic for comparison against all listed
    attributes.
    <pre><code>
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
    </code></pre>
    @name XM.Collection
    @extends Backbone.Collection
    */
  XM.Collection = Backbone.Collection.extend(/** @lends XM.Collection# */{

    /**
      If true forwards a `post` dispatch request to the server against a
      function named "fetch" on the recordType name of the collection's model.
      Otherwise calls `get` against the same.

      This makes it easy to re-route fetch calls to functions that may have
      much more complex logic than the normal `get` methodology and related
      crud methods can support.

      @default false
    */
    dispatch: false,

    fetchCount: 0,

    /**
      Handle status change.
      #refactor XXX just by calling collection.add(new Model()), my new model
      becomes magically READY_CLEAN instead of EMPTY or READY_NEW ??
    */
    add: function (models, options) {
      options = options = _.extend({ merge: true }, options);
      var result = Backbone.Collection.prototype.add.call(this, models, options),
        i,
        K = XM.Model;

      _.each(result.models, function (model) {
        model.setStatus(options.status || K.READY_CLEAN, {cascade: true, ignoreStatusChange: true});
      });
      return result;
    },

    /**
      Syncs the collection with the changed model.

      @this An instance of a collection
     */
    autoSync: function (model, status) {
      var cachedModel;

      // These model statuses change a lot, and it is difficult to come with a set of
      // statuses to trigger the cache sync that would get hit every time that it needed
      // to, but never needlessly. The rule right now is that if the model is DESTROYED_DIRTY,
      // or if it's in the READY_CLEAN that *follows* a BUSY_COMMITTING, then the cache should
      // be refreshed.

      // An extra quirk is that if the model is added by a list relations editor box
      // (e.g. ProjectVersion) there might be multiple ids that need to be set into the cache
      // when the parent model is being saved. This code remembers ALL of the models that are
      // in BUSY_COMMITTING, and then can recache each of them as they come back READY_CLEAN
      //
      if (status === XM.Model.BUSY_COMMITTING) {
        this._busyCommittingIds = this._busyCommittingIds || [];
        this._busyCommittingIds.push(model.id);
      }

      if ((status === XM.Model.READY_CLEAN && _.contains(this._busyCommittingIds, model.id)) ||
          status === XM.Model.DESTROYED_DIRTY) {

        this._busyCommittingIds = _.without(this._busyCommittingIds, model.id);
        cachedModel = _.find(this.models, function (m) {
          return m.id === model.id;
        });

        // perform the sync by removing the model if it's already in the collection,
        // and adding it unless it is being deleted.
        if (cachedModel) {
          this.remove(cachedModel);
        }
        if (status !== XM.Model.DESTROYED_DIRTY && !this.get(model.id)) {
          this.add(model);
        }
      }
    },

    /**
      Convenience wrapper for the backbone-relational function by the same name.
     */
    getObjectByName: function (name) {
      return Backbone.Relational.store.getObjectByName(name);
    },

    /**
      Return the current status.

      @returns {Number}
    */
    getStatus: function () {
      return this.status;
    },

    /**
     * Retrieve records from the xTuple data source.
     * Optionally retrieve a subset by passing query parameters.
     */
    fetch: function (options) {
      //
      // Use default order attribute if it's specified and if no options are specified
      // TODO: we should apply the default ordering even in the presence of options
      // so long as the options don't have an orderBy command
      //
      options = options ? _.clone(options) :
        this.orderAttribute ? { query: this.orderAttribute } : {};
      var fetchIndex = this.fetchCount + 1,
        success = options.success,
        that = this;

      this.fetchCount = fetchIndex;

      if (options.parse === void 0) {
        options.parse = true;
      }
      options.success = function (collection, resp, options) {
        var data = resp;

        // Bail if this query result has been superceded by another
        if (fetchIndex < that.fetchCount) { return; }

        // Dispatched fetches come back with a different response profile.
        // Fix it, Felix.
        if (that.dispatch) {
          data = collection;
          options = resp;
          collection = that;
        }

        var method = options.update ? 'update' : 'reset';
        collection[method](data, options);
        that.setStatus(XM.ModelClassMixin.READY_CLEAN);
        if (success) {
          success(collection, data, options);
        }
      };
      this.setStatus(XM.ModelClassMixin.BUSY_FETCHING);
      return this.sync('read', this, options);
    },

    initialize: function (attributes, options) {
      var status = this.getStatus();

      if (_.isNull(status)) {
        this.setStatus(XM.ModelClassMixin.EMPTY);
      }
    },


    /**
      Set the status on the model. Triggers `statusChange` event.

      @param {Number} Status
    */
    setStatus: function (status, options) {

      if (this.status === status) { return; }
      this._prevStatus = this.status;
      this.status = status;

      this.trigger('statusChange', this, status, options);
      this.trigger('status:' + XM.Model._status[status], this, status, options);
      return this;
    },

    /**
      Sync to xTuple data source.
    */
    sync: function (method, model, options) {
      var proto = model.model.prototype,
        query = options.query || {},
        payload = {
          nameSpace: proto.recordType.replace(/\.\w+/i, ''),
          type: proto.recordType.suffix(),
        },
        parameters = query.parameters;

      // Clean up parameters
      if (parameters && parameters.length) {
        XM.Collection.formatParameters(proto.recordType, parameters);
      }


      if (method === 'read' && options.success) {
        if (this.dispatch) {
          method = "post";
          payload.dispatch = {
            functionName: "fetch",
            parameters: query
          };
        } else {
          method = "get";
          payload.query = query;
        }

        return XT.dataSource.request(this, method, payload, options);
      }

      return false;
    },

    orderAttribute: null

  });

  /**
    Helper function to convert parameters to data source friendly formats
    @private
    @param {String} Record Type
    @param {Object} Query parameters
  */
  XM.Collection.formatParameters = function (recordType, params) {
    _.each(params, function (param) {
      var klass = recordType ? XT.getObjectByName(recordType) : null,
        relations = klass ? klass.prototype.relations : [],
        relation = _.find(relations, function (rel) {
          return rel.key === param.attribute;
        }),
        idAttribute;

      // Format date if applicable
      if (param.value instanceof Date) {
        param.value = param.value.toJSON();

      // Format record if applicable
      } else if (_.isObject(param.value) && !_.isArray(param.value)) {
        param.value = param.value.id;
      }

      // Format attribute if it's `HasOne` relation
      if (relation && relation.type === Backbone.HasOne && relation.isNested) {
        klass = XT.getObjectByName(relation.relatedModel);
        idAttribute = klass.prototype.idAttribute;
        param.attribute = param.attribute + '.' + idAttribute;
      }
    });
  };

}());
