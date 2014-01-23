select xt.install_js('XT','Rest','xtuple', $$

(function () {

  /**
   * @class
   *
   * The XT.Rest includes the four primary methods for doing work: get, post, patch, delete.
   */

  XT.Rest = {

    get: function (dataHash) {
      var data = Object.create(XT.Data);

      dataHash.superUser = false;
      if (dataHash.username) { XT.username = dataHash.username; }

      if (dataHash.id) {
        ret = data.retrieveRecord(dataHash);
      } else {
        ret = data.fetch(dataHash);
      }

      /* Unset XT.username so it isn't cached for future queries. */
      XT.username = undefined;

      /* return the results */
      XT.message(200, "OK");

      return ret;
    },

    post: function (dataHash) {
      var data = Object.create(XT.Data),
        prettyPrint = dataHash.prettyPrint ? 2 : null,
        dispatch = dataHash.dispatch,
        fetchCol,
        fetchRes,
        fetchSql,
        orm,
        pkey,
        prv,
        sql,
        observer,
        ret,
        obj,
        f,
        params,
        args,
        method;
      
      dataHash.superUser = false;

      if (dataHash.username) { XT.username = dataHash.username; }

      /* if there's data then commit it */
      if (dataHash.data) {
        orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type);
        pkey = XT.Orm.primaryKey(orm);
        nkey = XT.Orm.naturalKey(orm);
        prv = JSON.parse(JSON.stringify(dataHash.data));
        sql = "select nextval($1);";

        /* set status */
        XT.jsonpatch.updateState(dataHash.data, "create");

        /* Set natural key number if not provided. */
        if (nkey && (nkey !== pkey) && !dataHash.data[nkey]) {
          if (nkey === 'uuid') {
            dataHash.data[nkey] = XT.generateUUID();
          } else {
            /* Check if this is a fetchable number. */
            if (orm.orderSequence) {
              /* Since this is null, but required, fetch the next number for this and use it. */
              dataHash.data[nkey] = XM.Model.fetchNumber(dataHash.nameSpace + '.' + dataHash.type);
            } else {
              throw new handleError("A unique " + nkey + " must be provided", 449);
            }
          }
        }

        /* Set id if not provided. */
        if (!dataHash.id) {
          if (nkey) {
            if (dataHash.data[nkey] || nkey === 'uuid') {
              dataHash.id = dataHash.data[nkey] || XT.generateUUID();
            } else {
              throw new handleError("A unique id must be provided", 449);
            }
          } else if (orm.idSequenceName) {
            dataHash.id = dataHash.data[pkey] || plv8.execute(sql, [orm.idSequenceName])[0].nextval;
          } else {
            throw new handleError("A unique id must be provided", 449);
          }
        }

        /* commit the record */
        data.commitRecord(dataHash);

        if (dataHash.requery === false) {
          /* The requestor doesn't care to know what the record looks like now */
          ret = true;
        } else {
          /* calculate a patch of the modifed version */
          observer = XT.jsonpatch.observe(prv);
          dataHash.superUser = true;
          ret = data.retrieveRecord(dataHash);
          observer.object = ret.data;
          delete ret.data;
          ret.patches = XT.jsonpatch.generate(observer);
        }

      /* if it's a function dispatch call then execute it */
      } else if (dispatch) {
        obj = plv8[dataHash.nameSpace][dataHash.type];
        f = dispatch.functionName;
        params = dispatch.parameters;
        args = params instanceof Array ? params : [params];

        if (obj[f]) {
          method = obj[f].curry(args);
        } else {
          XT.username = undefined;
          throw new Error('Function ' + dataHash.nameSpace +
             '.' + dataHash.type + '.' + f + ' not found.');
        }

        ret = obj.isDispatchable ? method() : false;

        /**
         * Remove the requirement of passing 'isJSON' around.
         * Based on underscore: http://underscorejs.org/docs/underscore.html#section-88
         */
        ret = toString.call(ret) != '[object Number]' ?
          JSON.stringify(ret, null, prettyPrint) : ret;
      }

      /* Unset XT.username so it isn't cached for future queries. */
      XT.username = undefined;

      if (dataHash.dispatch) {
        XT.message(200, "OK");
      } else {
        XT.message(201, "Created");
      }

      return ret;
    },

    patch: function (dataHash) {
      var data = Object.create(XT.Data),
        result = [],
        options,
        patches,
        prettyPrint,
        orm,
        idKey,
        observer,
        prv,
        rec,
        ret;

      options = JSON.parse(JSON.stringify(dataHash));
      patches = options.patches;
      prettyPrint = dataHash.prettyPrint ? 2 : null;

      dataHash.superUser = false;
      if (dataHash.username) { XT.username = dataHash.username; }

      orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type);
      idKey = XT.Orm.naturalKey(orm) || XT.Orm.primaryKey(orm);

      /* get the current version of the record */
      prv = data.retrieveRecord(dataHash);
      dataHash.includeKeys = true;
      dataHash.superUser = true;
      rec = data.retrieveRecord(dataHash);

      /* apply the patch */
      if (!XT.jsonpatch.apply(rec.data, dataHash.patches, true)) {
        plv8.elog(ERROR, 'Malformed patch document');
      }
      options.data = rec.data;

      /* commit the record */
      data.commitRecord(options);

      if(options.requery === false) {
        /* The requestor doesn't care to know what the record looks like now */
        ret = true;
      } else {
        /* calculate a patch of the modifed version */
        XT.jsonpatch.apply(prv.data, patches);
        observer = XT.jsonpatch.observe(prv.data);
        dataHash.includeKeys = false;
        dataHash.id = prv.data[idKey];
        ret = data.retrieveRecord(dataHash);
        observer.object = ret.data;
        delete ret.data;
        ret.patches = XT.jsonpatch.generate(observer);
      }
      /* Unset XT.username so it isn't cached for future queries. */
      XT.username = undefined;

      XT.message(200, "OK");
    
      return ret;
    },

    delete: function (dataHash) {
      var data = Object.create(XT.Data),
        options,
        observer,
        rec;

      options = JSON.parse(JSON.stringify(dataHash));

      dataHash.superUser = false;
      if (dataHash.username) { XT.username = dataHash.username; }

      /* get the current version of the record */
      dataHash.includeKeys = true;
      rec = data.retrieveRecord(dataHash);
      if (!rec.data) { plv8.elog(ERROR, "Record not found"); };
      dataHash.data = rec.data;

      /* mark for deletion */
      XT.jsonpatch.updateState(dataHash.data, "delete");

      /* commit the record */
      data.commitRecord(dataHash);

      /* Unset XT.username so it isn't cached for future queries. */
      XT.username = undefined;

      XT.message(204, "No Content");

      return true;
    }

  }

}());

$$ );
