select xt.install_js('XT','Data','xtuple', $$

(function () {

  /**
   * @class
   *
   * The XT.Data class includes all functions necessary to process data source requests against the database.
   * It should be instantiated as an object against which its funtion calls are made. This class enforces privilege
   * control and as such is not and should not be dispatchable.
   */

  XT.Data = {

    ARRAY_TYPE: 'A',
    COMPOSITE_TYPE: 'C',
    DATE_TYPE: 'D',
    STRING_TYPE: 'S',

    CREATED_STATE: 'create',
    READ_STATE: 'read',
    UPDATED_STATE: 'update',
    DELETED_STATE: 'delete',

    /**
     * Build a SQL `where` clause based on privileges for name space and type,
     * and conditions and parameters passed.
     *
     * @seealso fetch
     *
     * @param {String} Name space
     * @param {String} Type
     * @param {Array} Parameters - optional
     * @returns {Object}
     */
    buildClause: function (nameSpace, type, parameters, orderBy) {
      parameters = parameters || [];

      var that = this,
        arrayIdentifiers = [],
        arrayParams,
        charSql,
        childOrm,
        clauses = [],
        count = 1,
        fromKeyProp,
        groupByColumnParams = [],
        identifiers = [],
        joinIdentifiers = [],
        orderByList = [],
        orderByColumnList = [],
        isArray = false,
        op,
        orClause,
        orderByIdentifiers = [],
        orderByColumnIdentifiers = [],
        orderByParams = [],
        orderByColumnParams = [],
        joins = [],
        orm = this.fetchOrm(nameSpace, type),
        param,
        params = [],
        parts,
        pcount,
        pertinentExtension,
        pgType,
        prevOrm,
        privileges = orm.privileges,
        prop,
        sourceTableAlias,
        ret = {};

      ret.conditions = "";
      ret.parameters = [];

      /* Handle privileges. */
      if (orm.isNestedOnly) { plv8.elog(ERROR, 'Access Denied'); }
      if (privileges &&
          (!privileges.all ||
            (privileges.all &&
              (!this.checkPrivilege(privileges.all.read) &&
              !this.checkPrivilege(privileges.all.update)))
          ) &&
          privileges.personal &&
          (this.checkPrivilege(privileges.personal.read) ||
            this.checkPrivilege(privileges.personal.update))
        ) {

        parameters.push({
          attribute: privileges.personal.properties,
          isLower: true,
          isUsernamePrivFilter: true,
          value: XT.username
        });
      }

      /* Support the short cut wherein the client asks for a filter on a toOne with a
        string. Technically they should use "theAttr.theAttrNaturalKey", but if they
        don't, massage the inputs as if they did */
      parameters.map(function (parameter) {
        var attributeIsString = typeof parameter.attribute === 'string';
          attributes = attributeIsString ? [parameter.attribute] : parameter.attribute;

        attributes.map(function (attribute) {
          var rootAttribute = (attribute.indexOf('.') < 0) ? attribute : attribute.split(".")[0],
            prop = XT.Orm.getProperty(orm, rootAttribute),
            propName = prop.name,
            childOrm,
            naturalKey,
            index,
            walkPath = function (pathParts, currentOrm, pathIndex) {
              var currentAttributeIsString = typeof pathParts[pathIndex] === 'string',
                currentProp = XT.Orm.getProperty(currentOrm, pathParts[pathIndex]),
                subChildOrm,
                naturalKey;

              if ((currentProp.toOne || currentProp.toMany)) {
                if (currentProp.toOne && currentProp.toOne.type) {
                  subChildOrm = that.fetchOrm(nameSpace, currentProp.toOne.type);
                } else if (currentProp.toMany && currentProp.toMany.type) {
                  subChildOrm = that.fetchOrm(nameSpace, currentProp.toMany.type);
                } else {
                  plv8.elog(ERROR, "toOne or toMany property is missing it's 'type': " + currentProp.name);
                }

                if (pathIndex < pathParts.length - 1) {
                  /* Recurse. */
                  walkPath(pathParts, subChildOrm, pathIndex + 1);
                } else {
                  /* This is the end of the path. */
                  naturalKey = XT.Orm.naturalKey(subChildOrm);
                  if (currentAttributeIsString) {
                    /* add the natural key to the end of the requested attribute */
                    parameter.attribute = attribute + "." + naturalKey;
                  } else {
                    /* swap out the attribute in the array for the one with the prepended natural key */
                    index = parameter.attribute.indexOf(attribute);
                    parameter.attribute.splice(index, 1);
                    parameter.attribute.splice(index, 0, attribute + "."  + naturalKey);
                  }
                }
              }
            }

          if ((prop.toOne || prop.toMany)) {
            /* Someone is querying on a toOne without using a path */
            if (prop.toOne && prop.toOne.type) {
              childOrm = that.fetchOrm(nameSpace, prop.toOne.type);
            } else if (prop.toMany && prop.toMany.type) {
              childOrm = that.fetchOrm(nameSpace, prop.toMany.type);
            } else {
              plv8.elog(ERROR, "toOne or toMany property is missing it's 'type': " + prop.name);
            }

            if (attribute.indexOf('.') < 0) {
              naturalKey = XT.Orm.naturalKey(childOrm);
              if (attributeIsString) {
                /* add the natural key to the end of the requested attribute */
                parameter.attribute = attribute + "." + naturalKey;
              } else {
                /* swap out the attribute in the array for the one with the prepended natural key */
                index = parameter.attribute.indexOf(attribute);
                parameter.attribute.splice(index, 1);
                parameter.attribute.splice(index, 0, attribute + "."  + naturalKey);
              }
            } else {
              /* Even if there's a path x.y, it's possible that it's still not
                correct because the correct path maybe is x.y.naturalKeyOfY */
              walkPath(attribute.split("."), orm, 0);
            }
          }
        });
      });

      /* Handle parameters. */
      if (parameters.length) {
        for (var i = 0; i < parameters.length; i++) {
          orClause = [];
          param = parameters[i];
          op = param.operator || '=';
          switch (op) {
          case '=':
          case '>':
          case '<':
          case '>=':
          case '<=':
          case '!=':
            break;
          case 'BEGINS_WITH':
            op = '~^';
            break;
          case 'ENDS_WITH':
            op = '~?';
            break;
          case 'MATCHES':
            op = '~*';
            break;
          case 'ANY':
            op = '<@';
            for (var c = 0; c < param.value.length; c++) {
              ret.parameters.push(param.value[c]);
              param.value[c] = '$' + count;
              count++;
            }
            break;
          case 'NOT ANY':
            op = '!<@';
            for (var c = 0; c < param.value.length; c++) {
              ret.parameters.push(param.value[c]);
              param.value[c] = '$' + count;
              count++;
            }
            break;
          default:
            plv8.elog(ERROR, 'Invalid operator: ' + op);
          }

          /* Handle characteristics. This is very specific to xTuple,
             and highly dependant on certain table structures and naming conventions,
             but otherwise way too much work to refactor in an abstract manner right now. */
          if (param.isCharacteristic) {
            /* Handle array. */
            if (op === '<@') {
              param.value = ' ARRAY[' + param.value.join(',') + ']';
            }

            /* Booleans are stored as strings. */
            if (param.value === true) {
              param.value = 't';
            } else if (param.value === false) {
              param.value = 'f';
            }

            /* Yeah, it depends on a property called 'characteristics'... */
            prop = XT.Orm.getProperty(orm, 'characteristics');

            /* Build the characteristics query clause. */
            identifiers.push(XT.Orm.primaryKey(orm, true));
            identifiers.push(prop.toMany.inverse);
            identifiers.push(orm.nameSpace.toLowerCase());
            identifiers.push(prop.toMany.type.decamelize());
            identifiers.push(param.attribute);
            identifiers.push(param.value);

            charSql = '%' + (identifiers.length - 5) + '$I in (' +
                      '  select %' + (identifiers.length - 4) + '$I '+
                      '  from %' + (identifiers.length - 3) + '$I.%' + (identifiers.length - 2) + '$I ' +
                      '    join char on (char_name = characteristic)' +
                      '  where 1=1 ' +
                      /* Note: Not using $i for these. L = literal here. These is not identifiers. */
                      '    and char_name = %' + (identifiers.length - 1) + '$L ' +
                      '    and value ' + op + ' %' + (identifiers.length) + '$L ' +
                      ')';

            clauses.push(charSql);

          /* Array comparisons handle another way. e.g. %1$I !<@ ARRAY[$1,$2] */
          } else if (op === '<@' || op === '!<@') {
            /* Handle paths if applicable. */
            if (param.attribute.indexOf('.') > -1) {
              parts = param.attribute.split('.');
              childOrm = this.fetchOrm(nameSpace, type);
              params.push("");
              pcount = params.length - 1;

              for (var n = 0; n < parts.length; n++) {
                /* Validate attribute. */
                prop = XT.Orm.getProperty(childOrm, parts[n]);
                if (!prop) {
                  plv8.elog(ERROR, 'Attribute not found in object map: ' + parts[n]);
                }

                /* Build path. */
                if (n === parts.length - 1) {
                  identifiers.push("jt" + (joins.length - 1));
                  identifiers.push(prop.attr.column);
                  pgType = this.getPgTypeFromOrmType(
                    this.getNamespaceFromNamespacedTable(childOrm.table),
                    this.getTableFromNamespacedTable(childOrm.table),
                    prop.attr.column
                  );
                  pgType = pgType ? "::" + pgType + "[]" : '';
                  params[pcount] += "%" + (identifiers.length - 1) + "$I.%" + identifiers.length + "$I";
                  params[pcount] += ' ' + op + ' ARRAY[' + param.value.join(',') + ']' + pgType;
                } else {
                  childOrm = this.fetchOrm(nameSpace, prop.toOne.type);
                  sourceTableAlias = n === 0 ? "t1" : "jt" + (joins.length - 1);
                  joinIdentifiers.push(
                    this.getNamespaceFromNamespacedTable(childOrm.table),
                    this.getTableFromNamespacedTable(childOrm.table),
                    sourceTableAlias, prop.toOne.column,
                    XT.Orm.primaryKey(childOrm, true));
                  joins.push("left join %" + (joinIdentifiers.length - 4) + "$I.%" + (joinIdentifiers.length - 3)
                    + "$I jt" + joins.length + " on %"
                    + (joinIdentifiers.length - 2) + "$I.%"
                    + (joinIdentifiers.length - 1) + "$I = jt" + joins.length + ".%" + joinIdentifiers.length + "$I");
                }
              }
            } else {
              prop = XT.Orm.getProperty(orm, param.attribute);
              pertinentExtension = XT.Orm.getProperty(orm, param.attribute, true);
              if(pertinentExtension.isChild || pertinentExtension.isExtension) {
                /* We'll need to join this orm extension */
                fromKeyProp = XT.Orm.getProperty(orm, pertinentExtension.relations[0].inverse);
                joinIdentifiers.push(
                  this.getNamespaceFromNamespacedTable(pertinentExtension.table),
                  this.getTableFromNamespacedTable(pertinentExtension.table),
                  fromKeyProp.attr.column,
                  pertinentExtension.relations[0].column);
                joins.push("left join %" + (joinIdentifiers.length - 3) + "$I.%" + (joinIdentifiers.length - 2)
                  + "$I jt" + joins.length + " on t1.%"
                  + (joinIdentifiers.length - 1) + "$I = jt" + joins.length + ".%" + joinIdentifiers.length + "$I");
              }
              if (!prop) {
                plv8.elog(ERROR, 'Attribute not found in object map: ' + param.attribute);
              }

              identifiers.push(pertinentExtension.isChild || pertinentExtension.isExtension ?
                "jt" + (joins.length - 1) :
                "t1");
              identifiers.push(prop.attr.column);
              pgType = this.getPgTypeFromOrmType(
                this.getNamespaceFromNamespacedTable(orm.table),
                this.getTableFromNamespacedTable(orm.table),
                prop.attr.column
              );
              pgType = pgType ? "::" + pgType + "[]" : '';
              params.push("%" + (identifiers.length - 1) + "$I.%" + identifiers.length + "$I " + op + ' ARRAY[' + param.value.join(',') + ']' + pgType);
              pcount = params.length - 1;
            }
            clauses.push(params[pcount]);

          /* Everything else handle another. */
          } else {
            if (XT.typeOf(param.attribute) !== 'array') {
              param.attribute = [param.attribute];
            }

            for (var c = 0; c < param.attribute.length; c++) {
              /* Handle paths if applicable. */
              if (param.attribute[c].indexOf('.') > -1) {
                parts = param.attribute[c].split('.');
                childOrm = this.fetchOrm(nameSpace, type);
                params.push("");
                pcount = params.length - 1;
                isArray = false;

                /* Check if last part is an Array. */
                for (var m = 0; m < parts.length; m++) {
                  /* Validate attribute. */
                  prop = XT.Orm.getProperty(childOrm, parts[m]);
                  if (!prop) {
                    plv8.elog(ERROR, 'Attribute not found in object map: ' + parts[m]);
                  }

                  if (m < parts.length - 1) {
                    if (prop.toOne && prop.toOne.type) {
                      childOrm = this.fetchOrm(nameSpace, prop.toOne.type);
                    } else if (prop.toMany && prop.toMany.type) {
                      childOrm = this.fetchOrm(nameSpace, prop.toMany.type);
                    } else {
                      plv8.elog(ERROR, "toOne or toMany property is missing it's 'type': " + prop.name);
                    }
                  } else if (prop.attr && prop.attr.type === 'Array') {
                    /* The last property in the path is an array. */
                    isArray = true;
                    params[pcount] = '$' + count;
                  }
                }

                /* Reset the childOrm to parent. */
                childOrm = this.fetchOrm(nameSpace, type);

                for (var n = 0; n < parts.length; n++) {
                  /* Validate attribute. */
                  prop = XT.Orm.getProperty(childOrm, parts[n]);
                  if (!prop) {
                    plv8.elog(ERROR, 'Attribute not found in object map: ' + parts[n]);
                  }

                  /* Do a persional privs array search e.g. 'admin' = ANY (usernames_array). */
                  if (param.isUsernamePrivFilter && isArray) {
                    identifiers.push(prop.attr.column);
                    arrayIdentifiers.push(identifiers.length);

                    if (n < parts.length - 1) {
                      childOrm = this.fetchOrm(nameSpace, prop.toOne.type);
                    }
                  } else {
                    pertinentExtension = XT.Orm.getProperty(childOrm, parts[n], true);
                    var isExtension = pertinentExtension.isChild || pertinentExtension.isExtension;
                    if(isExtension) {
                      /* We'll need to join this orm extension */
                      fromKeyProp = XT.Orm.getProperty(orm, pertinentExtension.relations[0].inverse);
                      joinIdentifiers.push(
                        this.getNamespaceFromNamespacedTable(pertinentExtension.table),
                        this.getTableFromNamespacedTable(pertinentExtension.table),
                        fromKeyProp.attr.column,
                        pertinentExtension.relations[0].column);
                      joins.push("left join %" + (joinIdentifiers.length - 3) + "$I.%" + (joinIdentifiers.length - 2)
                        + "$I jt" + joins.length + " on t1.%"
                        + (joinIdentifiers.length - 1) + "$I = jt" + joins.length + ".%" + joinIdentifiers.length + "$I");
                    }
                    /* Build path, e.g. table_name.column_name */
                    if (n === parts.length - 1) {
                      identifiers.push("jt" + (joins.length - 1));
                      identifiers.push(prop.attr.column);
                      params[pcount] += "%" + (identifiers.length - 1) + "$I.%" + identifiers.length + "$I";
                      if (param.isLower) {
                        params[pcount] = "lower(" + params[pcount] + ")";
                      }
                    } else {
                      sourceTableAlias = n === 0 && !isExtension ? "t1" : "jt" + (joins.length - 1);
                      if (prop.toOne && prop.toOne.type) {
                        childOrm = this.fetchOrm(nameSpace, prop.toOne.type);
                        joinIdentifiers.push(
                          this.getNamespaceFromNamespacedTable(childOrm.table),
                          this.getTableFromNamespacedTable(childOrm.table),
                          sourceTableAlias, prop.toOne.column,
                          XT.Orm.primaryKey(childOrm, true)
                        );
                      } else if (prop.toMany && prop.toMany.type) {
                        childOrm = this.fetchOrm(nameSpace, prop.toMany.type);
                        joinIdentifiers.push(
                          this.getNamespaceFromNamespacedTable(childOrm.table),
                          this.getTableFromNamespacedTable(childOrm.table),
                          sourceTableAlias, prop.toMany.column,
                          XT.Orm.primaryKey(childOrm, true)
                        );
                      }
                      joins.push("left join %" + (joinIdentifiers.length - 4) + "$I.%" + (joinIdentifiers.length - 3)
                        + "$I jt" + joins.length + " on %"
                        + (joinIdentifiers.length - 2) + "$I.%"
                        + (joinIdentifiers.length - 1) + "$I = jt" + joins.length + ".%" + joinIdentifiers.length + "$I");
                    }
                  }
                }
              } else {
                /* Validate attribute. */
                prop = XT.Orm.getProperty(orm, param.attribute[c]);
                pertinentExtension = XT.Orm.getProperty(orm, param.attribute[c], true);
                if(pertinentExtension.isChild || pertinentExtension.isExtension) {
                  /* We'll need to join this orm extension */
                  fromKeyProp = XT.Orm.getProperty(orm, pertinentExtension.relations[0].inverse);
                  joinIdentifiers.push(
                    this.getNamespaceFromNamespacedTable(pertinentExtension.table),
                    this.getTableFromNamespacedTable(pertinentExtension.table),
                    fromKeyProp.attr.column,
                    pertinentExtension.relations[0].column);
                  joins.push("left join %" + (joinIdentifiers.length - 3) + "$I.%" + (joinIdentifiers.length - 2)
                    + "$I jt" + joins.length + " on t1.%"
                    + (joinIdentifiers.length - 1) + "$I = jt" + joins.length + ".%" + joinIdentifiers.length + "$I");
                }
                if (!prop) {
                  plv8.elog(ERROR, 'Attribute not found in object map: ' + param.attribute[c]);
                }

                identifiers.push(pertinentExtension.isChild || pertinentExtension.isExtension ?
                  "jt" + (joins.length - 1) :
                  "t1");
                identifiers.push(prop.attr.column);

                /* Do a persional privs array search e.g. 'admin' = ANY (usernames_array). */
                if (param.isUsernamePrivFilter && ((prop.toMany && !prop.isNested) ||
                  (prop.attr && prop.attr.type === 'Array'))) {

                  params.push('$' + count);
                  pcount = params.length - 1;
                  arrayIdentifiers.push(identifiers.length);
                } else {
                  params.push("%" + (identifiers.length - 1) + "$I.%" + identifiers.length + "$I");
                  pcount = params.length - 1;
                }
              }

              /* Add persional privs array search. */
              if (param.isUsernamePrivFilter && ((prop.toMany && !prop.isNested)
                || (prop.attr && prop.attr.type === 'Array') || isArray)) {

                /* XXX: this bit of code has not been touched by the optimization refactor */
                /* e.g. 'admin' = ANY (usernames_array) */
                arrayParams = "";
                params[pcount] += ' ' + op + ' ANY (';

                /* Build path. e.g. ((%1$I).%2$I).%3$I */
                for (var f =0; f < arrayIdentifiers.length; f++) {
                  arrayParams += '%' + arrayIdentifiers[f] + '$I';
                  if (f < arrayIdentifiers.length - 1) {
                    arrayParams = "(" + arrayParams + ").";
                  }
                }
                params[pcount] += arrayParams + ')';

              /* Add optional is null clause. */
              } else if (parameters[i].includeNull) {
                /* e.g. %1$I = $1 or %1$I is null */
                params[pcount] = params[pcount] + " " + op + ' $' + count + ' or ' + params[pcount] + ' is null';
              } else {
                /* e.g. %1$I = $1 */
                params[pcount] += " " + op + ' $' + count;
              }

              orClause.push(params[pcount]);
            }

            /* If more than one clause we'll get: (%1$I = $1 or %1$I = $2 or %1$I = $3) */
            clauses.push('(' + orClause.join(' or ') + ')');
            count++;
            ret.parameters.push(param.value);
          }
        }
      }

      ret.conditions = (clauses.length ? '(' + XT.format(clauses.join(' and '), identifiers) + ')' : ret.conditions) || true;

      /* Massage orderBy with quoted identifiers. */
      /* We need to support the xm case for sql2 and the xt/public (column) optimized case for sql1 */
      /* In practice we build the two lists independently of one another */
      if (orderBy) {
        for (var i = 0; i < orderBy.length; i++) {
          /* Handle path case. */
          if (orderBy[i].attribute.indexOf('.') > -1) {
            parts = orderBy[i].attribute.split('.');
            prevOrm = orm;
            orderByParams.push("");
            orderByColumnParams.push("");
            groupByColumnParams.push("");
            pcount = orderByParams.length - 1;

            for (var n = 0; n < parts.length; n++) {
              prop = XT.Orm.getProperty(orm, parts[n]);
              if (!prop) {
                plv8.elog(ERROR, 'Attribute not found in map: ' + parts[n]);
              }
              orderByIdentifiers.push(parts[n]);
              orderByParams[pcount] += "%" + orderByIdentifiers.length + "$I";

              if (n === parts.length - 1) {
                orderByColumnIdentifiers.push("jt" + (joins.length - 1));
                orderByColumnIdentifiers.push(prop.attr.column);
                orderByColumnParams[pcount] += "%" + (orderByColumnIdentifiers.length - 1) + "$I.%" + orderByColumnIdentifiers.length + "$I"
                groupByColumnParams[pcount] += "%" + (orderByColumnIdentifiers.length - 1) + "$I.%" + orderByColumnIdentifiers.length + "$I"
              } else {
                orderByParams[pcount] = "(" + orderByParams[pcount] + ").";
                orm = this.fetchOrm(nameSpace, prop.toOne.type);
                sourceTableAlias = n === 0 ? "t1" : "jt" + (joins.length - 1);
                joinIdentifiers.push(
                  this.getNamespaceFromNamespacedTable(orm.table),
                  this.getTableFromNamespacedTable(orm.table),
                  sourceTableAlias, prop.toOne.column,
                  XT.Orm.primaryKey(orm, true));
                joins.push("left join %" + (joinIdentifiers.length - 4) + "$I.%" + (joinIdentifiers.length - 3)
                  + "$I jt" + joins.length + " on %"
                  + (joinIdentifiers.length - 2) + "$I.%"
                  + (joinIdentifiers.length - 1) + "$I = jt" + joins.length + ".%" + joinIdentifiers.length + "$I");
              }
            }
            orm = prevOrm;
          /* Normal case. */
          } else {
            prop = XT.Orm.getProperty(orm, orderBy[i].attribute);
            if (!prop) {
              plv8.elog(ERROR, 'Attribute not found in map: ' + orderBy[i].attribute);
            }
            orderByIdentifiers.push(orderBy[i].attribute);
            orderByColumnIdentifiers.push("t1");
            /*
              We might need to look at toOne if the client is asking for a toOne without specifying
              the path. Unfortunately, if they do specify the path, then sql2 will fail. So this does
              work, although we're really sorting by the primary key of the toOne, whereas the
              user probably wants us to sort by the natural key TODO
            */
            orderByColumnIdentifiers.push(prop.attr ? prop.attr.column : prop.toOne.column);
            orderByParams.push("%" + orderByIdentifiers.length + "$I");
            orderByColumnParams.push("%" + (orderByColumnIdentifiers.length - 1) + "$I.%" + orderByColumnIdentifiers.length + "$I");
            groupByColumnParams.push("%" + (orderByColumnIdentifiers.length - 1) + "$I.%" + orderByColumnIdentifiers.length + "$I");
            pcount = orderByParams.length - 1;
          }

          if (orderBy[i].isEmpty) {
            orderByParams[pcount] = "length(" + orderByParams[pcount] + ")=0";
            orderByColumnParams[pcount] = "length(" + orderByColumnParams[pcount] + ")=0";
          }
          if (orderBy[i].descending) {
            orderByParams[pcount] += " desc";
            orderByColumnParams[pcount] += " desc";
          }

          orderByList.push(orderByParams[pcount])
          orderByColumnList.push(orderByColumnParams[pcount])
        }
      }

      ret.orderBy = orderByList.length ? XT.format('order by ' + orderByList.join(','), orderByIdentifiers) : '';
      ret.orderByColumns = orderByColumnList.length ? XT.format('order by ' + orderByColumnList.join(','), orderByColumnIdentifiers) : '';
      ret.groupByColumns = groupByColumnParams.length ? XT.format(', ' + groupByColumnParams.join(','), orderByColumnIdentifiers) : '';
      ret.joins = joins.length ? XT.format(joins.join(' '), joinIdentifiers) : '';

      return ret;
    },

    /**
     * Queries whether the current user has been granted the privilege passed.
     *
     * @param {String} privilege
     * @returns {Boolean}
     */
    checkPrivilege: function (privilege) {
      var i,
        privArray,
        res,
        ret = privilege,
        sql;

      if (typeof privilege === 'string') {
        if (!this._granted) { this._granted = {}; }
        if (!this._granted[XT.username]) { this._granted[XT.username] = {}; }
        if (this._granted[XT.username][privilege] !== undefined) { return this._granted[XT.username][privilege]; }

        /* The privilege name is allowed to be a set of space-delimited privileges */
        /* If a user has any of the applicable privileges then they get access */
        privArray = privilege.split(" ");
        sql = 'select coalesce(usrpriv_priv_id, grppriv_priv_id, -1) > 0 as granted ' +
               'from priv ' +
               'left join usrpriv on (priv_id=usrpriv_priv_id) and (usrpriv_username=$1) ' +
               'left join ( ' +
               '  select distinct grppriv_priv_id ' +
               '  from grppriv ' +
               '    join usrgrp on (grppriv_grp_id=usrgrp_grp_id) and (usrgrp_username=$1) ' +
               '  ) grppriv on (grppriv_priv_id=priv_id) ' +
               'where priv_name = $2';

        for (var i = 1; i < privArray.length; i++) {
          sql = sql + ' or priv_name = $' + (i + 2);
        }
        sql = sql + "order by granted desc limit 1;";

        /* Cleverness: the query parameters are just the priv array with the username tacked on front. */
        privArray.unshift(XT.username);

        if (DEBUG) {
          XT.debug('checkPrivilege sql =', sql);
          XT.debug('checkPrivilege values =', privArray);
        }
        res = plv8.execute(sql, privArray);
        ret = res.length ? res[0].granted : false;

        /* Memoize. */
        this._granted[XT.username][privilege] = ret;
      }

      if (DEBUG) {
        XT.debug('Privilege check for "' + XT.username + '" on "' + privilege + '" returns ' + ret);
      }

      return ret;
    },

    /**
     * Validate whether user has read access to data. If a record is passed, check personal privileges of
     * that record.
     *
     * @param {String} name space
     * @param {String} type name
     * @param {Object} record - optional
     * @param {Boolean} is top level, default is true
     * @returns {Boolean}
     */
    checkPrivileges: function (nameSpace, type, record, isTopLevel) {
      isTopLevel = isTopLevel !== false ? true : false;
      var action =  record && record.dataState === this.CREATED_STATE ? 'create' :
                  record && record.dataState === this.DELETED_STATE ? 'delete' :
                  record && record.dataState === this.UPDATED_STATE ? 'update' : 'read',
        committing = record ? record.dataState !== this.READ_STATE : false,
        isGrantedAll = true,
        isGrantedPersonal = false,
        map = this.fetchOrm(nameSpace, type),
        privileges = map.privileges,
        pkey,
        old;

      /* If there is no ORM, this isn't a table data type so no check required. */
      /*
      if (DEBUG) {
        XT.debug('orm type is ->', map.type);
        XT.debug('orm is ->', map);
      }
      */
      if (!map) { return true; }

      /* Can not access 'nested only' records directly. */
      if (DEBUG) {
        XT.debug('is top level ->', isTopLevel);
        XT.debug('is nested ->', map.isNestedOnly);
      }
      if (isTopLevel && map.isNestedOnly) { return false; }

      /* Check privileges - first do we have access to anything? */
      if (privileges) {
        if (DEBUG) { XT.debug('privileges found', privileges); }
        if (committing) {
          if (DEBUG) { XT.debug('is committing'); }

          /* Check if user has 'all' read privileges. */
          isGrantedAll = privileges.all ? this.checkPrivilege(privileges.all[action]) : false;

          /* Otherwise check for 'personal' read privileges. */
          if (!isGrantedAll) {
            isGrantedPersonal =  privileges.personal ?
              this.checkPrivilege(privileges.personal[action]) : false;
          }
        } else {
          if (DEBUG) { XT.debug('is NOT committing'); }

          /* Check if user has 'all' read privileges. */
          isGrantedAll = privileges.all ?
                         this.checkPrivilege(privileges.all.read) ||
                         this.checkPrivilege(privileges.all.update) : false;

          /* Otherwise check for 'personal' read privileges. */
          if (!isGrantedAll) {
            isGrantedPersonal =  privileges.personal ?
              this.checkPrivilege(privileges.personal.read) ||
              this.checkPrivilege(privileges.personal.update) : false;
          }
        }
      }

      /* If we're checknig an actual record and only have personal privileges, */
      /* see if the record allows access. */
      if (record && !isGrantedAll && isGrantedPersonal && action !== "create") {
        if (DEBUG) { XT.debug('checking record level personal privileges'); }
        var that = this,

        /* Shared checker function that checks 'personal' properties for access rights. */
        checkPersonal = function (record) {
          var i = 0,
            isGranted = false,
            props = privileges.personal.properties,
            get = function (obj, target) {
              var idx,
                part,
                parts = target.split("."),
                ret;

              for (var idx = 0; idx < parts.length; idx++) {
                part = parts[idx];
                ret = ret ? ret[part] : obj[part];
                if (ret === null || ret === undefined) {
                  return null;
                }
              }

              return ret;
            };

          while (!isGranted && i < props.length) {
            var prop = props[i],
                personalUser = get(record, prop);

            if (personalUser instanceof Array) {
              for (var userIdx = 0; userIdx < personalUser.length; userIdx++) {
                if (personalUser[userIdx].toLowerCase() === XT.username) {
                  isGranted = true;
                }
              }
            } else if (personalUser) {
              isGranted = personalUser.toLowerCase() === XT.username;
            }

            i++;
          }

          return isGranted;
        };

        /* If committing we need to ensure the record in its previous state is editable by this user. */
        if (committing && (action === 'update' || action === 'delete')) {
          pkey = XT.Orm.naturalKey(map) || XT.Orm.primaryKey(map);
          old = this.retrieveRecord({
            nameSpace: nameSpace,
            type: type,
            id: record[pkey],
            superUser: true,
            includeKeys: true
          });
          isGrantedPersonal = checkPersonal(old.data);

        /* Otherwise check personal privileges on the record passed. */
        } else if (action === 'read') {
          isGrantedPersonal = checkPersonal(record);
        }
      }

      if (DEBUG) {
        XT.debug('is granted all ->', isGrantedAll);
        XT.debug('is granted personal ->', isGrantedPersonal);
      }

      return isGrantedAll || isGrantedPersonal;
    },

    /**
     * Commit array columns with their own statements
     *
     * @param {Object} Orm
     * @param {Object} Record
     */
    commitArrays: function (orm, record, encryptionKey) {
      var pkey = XT.Orm.primaryKey(orm),
        fkey,
        ormp,
        prop,
        val,
        values,
        columnToKey,
        propToKey,

        resolveKey = function (col) {
          var attr;

          /* First search properties */
          var ary = orm.properties.filter(function (prop) {
            return prop.attr && prop.attr.column === col;
          });

          if (ary.length) {
            attr =  ary[0].name;

          } else {
            /* If not found must be extension, search relations */
            if (orm.extensions.length) {
              orm.extensions.forEach(function (ext) {
                if (!attr) {
                  ary = ext.relations.filter(function (prop) {
                    return prop.column === col;
                  });

                  if (ary.length) {
                    attr = ary[0].inverse;
                  }
                }
              })
            };
          }
          if (attr) { return attr };

          /* If still not found, we have a structural problem */
          throw new Error("Can not resolve primary id on toMany relation");
        };

      for (prop in record) {
        ormp = XT.Orm.getProperty(orm, prop);

        /* If the property is an array of objects they must be records so commit them. */
        if (ormp.toMany && ormp.toMany.isNested) {
          fkey = ormp.toMany.inverse;
          values = record[prop];

          for (var i = 0; i < values.length; i++) {
            val = values[i];

            /* Populate the parent key into the foreign key field if it's absent. */
            if (!val[fkey]) {
              columnToKey = ormp.toMany.column;
              propToKey = columnToKey ? resolveKey(columnToKey) : pkey;
              if (!record[propToKey]) {
                /* If there's no data, we have a structural problem */
                throw new Error("Can not resolve foreign key on toMany relation " + ormp.name);
              }
              val[fkey] = record[propToKey];
            }

            this.commitRecord({
              nameSpace: orm.nameSpace,
              type: ormp.toMany.type,
              data: val,
              encryptionKey: encryptionKey
            });
          }
        }
      }
    },

    /**
     * Commit metrics that have changed to the database.
     *
     * @param {Object} metrics
     * @returns Boolean
     */
    commitMetrics: function (metrics) {
      var key,
        sql = 'select setMetric($1,$2)',
        value;

      for (key in metrics) {
        value = metrics[key];
        if (typeof value === 'boolean') {
          value = value ? 't' : 'f';
        } else if (typeof value === 'number') {
          value = value.toString();
        }

        if (DEBUG) {
          XT.debug('commitMetrics sql =', sql);
          XT.debug('commitMetrics values =', [key, value]);
        }
        plv8.execute(sql, [key, value]);
      }

      return true;
    },

    /**
     * Commit a record to the database. The record must conform to the object hiearchy as defined by the
     * record's `ORM` definition. Each object in the tree must include state information on a reserved property
     * called `dataState`. Valid values are `create`, `update` and `delete`. Objects with other dataState values including
     * `undefined` will be ignored. State values can be added using `XT.jsonpatch.updateState(obj, state)`.
     *
     * @seealso XT.jsonpatch.updateState
     * @param {Object} Options
     * @param {String} [options.nameSpace] Namespace. Required.
     * @param {String} [options.type] Type. Required.
     * @param {Object} [options.data] The data payload to be processed. Required
     * @param {Number} [options.etag] Record version for optimistic locking.
     * @param {Object} [options.lock] Lock information for pessemistic locking.
     * @param {Boolean} [options.superUser=false] If true ignore privilege checking.
     * @param {String} [options.encryptionKey] Encryption key.
     */
    commitRecord: function (options) {
      var data = options.data,
        dataState = data ? data.dataState : false,
        hasAccess = options.superUser ||
          this.checkPrivileges(options.nameSpace, options.type, data, false);

      if (!hasAccess) { throw new Error("Access Denied."); }
      switch (dataState)
      {
      case (this.CREATED_STATE):
        this.createRecord(options);
        break;
      case (this.UPDATED_STATE):
        this.updateRecord(options);
        break;
      case (this.DELETED_STATE):
        this.deleteRecord(options);
      }
    },

    /**
     * Commit insert to the database
     *
     * @param {Object} Options
     * @param {String} [options.nameSpace] Namespace. Required.
     * @param {String} [options.type] Type. Required.
     * @param {Object} [options.data] The data payload to be processed. Required.
     * @param {String} [options.encryptionKey] Encryption key.
     */
    createRecord: function (options) {
      var data = options.data,
        encryptionKey = options.encryptionKey,
        i,
        orm = this.fetchOrm(options.nameSpace, options.type),
        sql = this.prepareInsert(orm, data, null, encryptionKey),
        pkey = XT.Orm.primaryKey(orm),
        rec;

      /* Handle extensions on the same table. */
      for (var i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table === orm.table) {
          sql = this.prepareInsert(orm.extensions[i], data, sql, encryptionKey);
        }
      }

      /* Commit the base record. */
      if (DEBUG) {
        XT.debug('createRecord sql =', sql.statement);
        XT.debug('createRecord values =', sql.values);
      }

      if (sql.statement) {
        rec = plv8.execute(sql.statement, sql.values);
        /* Make sure the primary key is populated */
        if (!data[pkey]) {
          data[pkey] = rec[0].id;
        }
        /* Make sure the obj_uuid is populated, if applicable */
        if (!data.obj_uuid && rec[0] && rec[0].obj_uuid) {
          data.uuid = rec[0].obj_uuid;
        }
      }

      /* Handle extensions on other tables. */
      for (var i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table !== orm.table &&
           !orm.extensions[i].isChild) {
          sql = this.prepareInsert(orm.extensions[i], data, null, encryptionKey);

          if (DEBUG) {
            XT.debug('createRecord sql =', sql.statement);
            XT.debug('createRecord values =', sql.values);
          }

          if (sql.statement) {
            plv8.execute(sql.statement, sql.values);
          }
        }
      }

      /* Okay, now lets handle arrays. */
      this.commitArrays(orm, data, encryptionKey);
    },

    /**
     * Use an orm object and a record and build an insert statement. It
     * returns an object with a table name string, columns array, expressions
     * array and insert statement string that can be executed.
     *
     * The optional params object includes objects columns, expressions
     * that can be cumulatively added to the result.
     *
     * @params {Object} Orm
     * @params {Object} Record
     * @params {Object} Params - optional
     * @params {String} Encryption Key
     * @returns {Object}
     */
    prepareInsert: function (orm, record, params, encryptionKey) {
      var attr,
        attributePrivileges,
        columns,
        count,
        encryptQuery,
        encryptSql,
        exp,
        i,
        iorm,
        namespace,
        nkey,
        ormp,
        pkey = XT.Orm.primaryKey(orm),
        prop,
        query,
        sql = "select nextval($1) as id",
        table,
        toOneQuery,
        toOneSql,
        type,
        val,
        isValidSql = params && params.statement ? true : false,
        canEdit;

      params = params || {
        table: "",
        columns: [],
        expressions: [],
        identifiers: [],
        values: []
      };
      params.table = orm.table;
      count = params.values.length + 1;

      /* If no primary key, then create one. */
      if (!record[pkey] && orm.idSequenceName) {
        if (DEBUG) {
          XT.debug('prepareInsert sql =', sql);
          XT.debug('prepareInsert values =', [orm.idSequenceName]);
        }
        record[pkey] = plv8.execute(sql, [orm.idSequenceName])[0].id;
      }

      /* If extension handle key. */
      if (orm.relations) {
        for (var i = 0; i < orm.relations.length; i++) {
          column = orm.relations[i].column;
          if (!params.identifiers.contains(column)) {
            params.columns.push("%" + count + "$I");
            params.values.push(record[orm.relations[i].inverse]);
            params.expressions.push('$' + count);
            params.identifiers.push(orm.relations[i].column);
            count++;
          }
        }
      }

      /* Build up the content for insert of this record. */
      for (var i = 0; i < orm.properties.length; i++) {
        ormp = orm.properties[i];
        prop = ormp.name;

        if (ormp.toMany && ormp.toMany.column === 'obj_uuid') {
          params.parentUuid = true;
        }

        attr = ormp.attr ? ormp.attr : ormp.toOne ? ormp.toOne : ormp.toMany;
        type = attr.type;
        iorm = ormp.toOne ? this.fetchOrm(orm.nameSpace, ormp.toOne.type) : false,
        nkey = iorm ? XT.Orm.naturalKey(iorm, true) : false;
        val = ormp.toOne && record[prop] instanceof Object ?
          record[prop][nkey || ormp.toOne.inverse || 'id'] : record[prop];

        /**
         * Ignore derived fields for insert/update
         */
        if (attr.derived) continue;

        attributePrivileges = orm.privileges &&
          orm.privileges.attribute &&
          orm.privileges.attribute[prop];

        if(!attributePrivileges || attributePrivileges.create === undefined) {
          canEdit = true;
        } else if (typeof attributePrivileges.create === 'string') {
          canEdit = this.checkPrivilege(attributePrivileges.create);
        } else {
          canEdit = attributePrivileges.create; /* if it's true or false */
        }

        /* Handle fixed values. */
        if (attr.value !== undefined) {
          params.columns.push("%" + count + "$I");
          params.expressions.push('$' + count);
          params.values.push(attr.value);
          params.identifiers.push(attr.column);
          isValidSql = true;
          count++;

        /* Handle passed values. */
        } else if (canEdit && val !== undefined && val !== null && !ormp.toMany) {
          if (attr.isEncrypted) {
            if (encryptionKey) {
              encryptQuery = "select encrypt(setbytea(%1$L), setbytea(%2$L), %3$L)";
              encryptSql = XT.format(encryptQuery, [record[prop], encryptionKey, 'bf']);
              val = record[prop] ? plv8.execute(encryptSql)[0].encrypt : null;
              params.columns.push("%" + count + "$I");
              params.values.push(val);
              params.identifiers.push(attr.column);
              params.expressions.push("$" + count);
              isValidSql = true;
              count++;
            } else {
              throw new Error("No encryption key provided.");
            }
          } else {
            if (ormp.toOne && nkey) {
              if (iorm.table.indexOf(".") > 0) {
                toOneQuery = "select %1$I from %2$I.%3$I where %4$I = $" + count;
                toOneSql = XT.format(toOneQuery, [
                    XT.Orm.primaryKey(iorm, true),
                    iorm.table.beforeDot(),
                    iorm.table.afterDot(),
                    nkey
                  ]);
              } else {
                toOneQuery = "select %1$I from %2$I where %3$I = $" + count;
                toOneSql = XT.format(toOneQuery, [
                    XT.Orm.primaryKey(iorm, true),
                    iorm.table,
                    nkey
                  ]);
              }
              exp = "(" + toOneSql + ")";
              params.expressions.push(exp);
            } else {
              params.expressions.push('$' + count);
            }

            params.columns.push("%" + count + "$I");
            params.values.push(val);
            params.identifiers.push(attr.column);
            isValidSql = true;
            count++;
          }
        /* Handle null value if applicable. */
        } else if (canEdit && val === undefined || val === null) {
          if (attr.nullValue) {
            params.columns.push("%" + count + "$I");
            params.values.push(attr.nullValue);
            params.identifiers.push(attr.column);
            params.expressions.push('$' + count);
            isValidSql = true;
            count++;
          } else if (attr.required) {
            plv8.elog(ERROR, "Attribute " + ormp.name + " is required.");
          }
        }
      }

      if (!isValidSql) {
        return false;
      }

      /* Build the insert statement */
      columns = params.columns.join(', ');
      columns = XT.format(columns, params.identifiers);
      expressions = params.expressions.join(', ');
      expressions = XT.format(expressions, params.identifiers);

      if (params.table.indexOf(".") > 0) {
        namespace = params.table.beforeDot();
        table = params.table.afterDot();
        query = 'insert into %1$I.%2$I (' + columns + ') values (' + expressions + ')';
        params.statement = XT.format(query, [namespace, table]);
      } else {
        query = 'insert into %1$I (' + columns + ') values (' + expressions + ')';
        params.statement = XT.format(query, [params.table]);
      }

      /* If we can get the primary key column we want to return that
         for cases where it is determined behind the scenes */
      if (!record[pkey] && !params.primaryKey) {
        params.primaryKey = XT.Orm.primaryKey(orm, true);
      }

      if (params.primaryKey && params.parentUuid) {
        params.statement = params.statement + ' returning ' + params.primaryKey + ' as id, obj_uuid';
      } else if (params.parentUuid) {
        params.statement = params.statement + ' returning obj_uuid';
      } else if (params.primaryKey) {
        params.statement = params.statement + ' returning ' + params.primaryKey + ' as id';
      }

      if (DEBUG) {
        XT.debug('prepareInsert statement =', params.statement);
        XT.debug('prepareInsert values =', params.values);
      }

      return params;
    },

    /**
     * Commit update to the database
     *
     * @param {Object} Options
     * @param {String} [options.nameSpace] Namespace. Required.
     * @param {String} [options.type] Type. Required.
     * @param {Object} [options.data] The data payload to be processed. Required.
     * @param {Number} [options.etag] Record version for optimistic locking.
     * @param {Object} [options.lock] Lock information for pessemistic locking.
     * @param {String} [options.encryptionKey] Encryption key.
     */
    updateRecord: function (options) {
      var data = options.data,
        encryptionKey = options.encryptionKey,
        orm = this.fetchOrm(options.nameSpace, options.type),
        pkey = XT.Orm.primaryKey(orm),
        id = data[pkey],
        ext,
        etag = this.getVersion(orm, id),
        i,
        iORuQuery,
        iORuSql,
        lock,
        lockKey = options.lock && options.lock.key ? options.lock.key : false,
        lockTable = orm.lockTable || orm.table,
        rows,
        sql = this.prepareUpdate(orm, data, null, encryptionKey);

      /* Test for optimistic lock. */
      if (!XT.disableLocks && etag && options.etag !== etag) {
      // TODO - Improve error handling.
        plv8.elog(ERROR, "The version being updated is not current.");
      }
      /* Test for pessimistic lock. */
      if (orm.lockable) {
        lock = this.tryLock(lockTable, id, {key: lockKey});
        if (!lock.key) {
          // TODO - Improve error handling.
          plv8.elog(ERROR, "Can not obtain a lock on the record.");
        }
      }

      /* Okay, now lets handle arrays. */
      this.commitArrays(orm, data, encryptionKey);

      /* Handle extensions on the same table. */
      for (var i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table === orm.table) {
          sql = this.prepareUpdate(orm.extensions[i], data, sql, encryptionKey);
        }
      }

      sql.values.push(id);

      /* Commit the base record. */
      if (DEBUG) {
        XT.debug('updateRecord sql =', sql.statement);
        XT.debug('updateRecord values =', sql.values);
      }
      plv8.execute(sql.statement, sql.values);

      /* Handle extensions on other tables. */
      for (var i = 0; i < orm.extensions.length; i++) {
        ext = orm.extensions[i];
        if (ext.table !== orm.table &&
           !ext.isChild) {

          /* Determine whether to insert or update. */
          if (ext.table.indexOf(".") > 0) {
            iORuQuery = "select %1$I from %2$I.%3$I where %1$I = $1;";
            iORuSql = XT.format(iORuQuery, [
                ext.relations[0].column,
                ext.table.beforeDot(),
                ext.table.afterDot()
              ]);
          } else {
            iORuQuery = "select %1$I from %2$I where %1$I = $1;";
            iORuSql = XT.format(iORuQuery, [ext.relations[0].column, ext.table]);
          }

          if (DEBUG) {
            XT.debug('updateRecord sql =', iORuSql);
            XT.debug('updateRecord values =', [data[pkey]]);
          }
          rows = plv8.execute(iORuSql, [data[pkey]]);

          if (rows.length) {
            sql = this.prepareUpdate(ext, data, null, encryptionKey);
            sql.values.push(id);
          } else {
            sql = this.prepareInsert(ext, data, null, encryptionKey);
          }

          if (DEBUG) {
            XT.debug('updateRecord sql =', sql.statement);
            XT.debug('updateRecord values =', sql.values);
          }

          if (sql.statement) {
            plv8.execute(sql.statement, sql.values);
          }
        }
      }

      /* Release any lock. */
      if (orm.lockable) {
        this.releaseLock({table: lockTable, id: id});
      }
    },

    /**
     * Use an orm object and a record and build an update statement. It
     * returns an object with a table name string, expressions array and
     * insert statement string that can be executed.
     *
     * The optional params object includes objects columns, expressions
     * that can be cumulatively added to the result.
     *
     * @params {Object} Orm
     * @params {Object} Record
     * @params {Object} Params - optional
     * @returns {Object}
     */
    prepareUpdate: function (orm, record, params, encryptionKey) {
      var attr,
        attributePrivileges,
        columnKey,
        count,
        encryptQuery,
        encryptSql,
        exp,
        expressions,
        iorm,
        key,
        keyValue,
        namespace,
        ormp,
        pkey,
        prop,
        query,
        table,
        toOneQuery,
        toOneSql,
        type,
        val,
        isValidSql = false,
        canEdit;

      params = params || {
        table: "",
        expressions: [],
        identifiers: [],
        values: []
      };
      params.table = orm.table;
      count = params.values.length + 1;

      if (orm.relations) {
        /* Extension. */
        pkey = orm.relations[0].inverse;
        columnKey = orm.relations[0].column;
      } else {
        /* Base. */
        pkey = XT.Orm.primaryKey(orm);
        columnKey = XT.Orm.primaryKey(orm, true);
      }

      /* Build up the content for update of this record. */
      for (var i = 0; i < orm.properties.length; i++) {
        ormp = orm.properties[i];
        prop = ormp.name;
        attr = ormp.attr ? ormp.attr : ormp.toOne ? ormp.toOne : ormp.toMany;
        type = attr.type;
        iorm = ormp.toOne ? this.fetchOrm(orm.nameSpace, ormp.toOne.type) : false;
        nkey = iorm ? XT.Orm.naturalKey(iorm, true) : false;
        val = ormp.toOne && record[prop] instanceof Object ?
          record[prop][nkey || ormp.toOne.inverse || 'id'] : record[prop],

        attributePrivileges = orm.privileges &&
          orm.privileges.attribute &&
          orm.privileges.attribute[prop];

        /**
         * Ignore derived fields for insert/update
         */
        if (attr.derived) continue;

        if(!attributePrivileges || attributePrivileges.update === undefined) {
          canEdit = true;
        } else if (typeof attributePrivileges.update === 'string') {
          canEdit = this.checkPrivilege(attributePrivileges.update);
        } else {
          canEdit = attributePrivileges.update; /* if it's true or false */
        }

        if (canEdit && val !== undefined && !ormp.toMany) {

          /* Handle encryption if applicable. */
          if (attr.isEncrypted) {
            if (encryptionKey) {
              encryptQuery = "select encrypt(setbytea(%1$L), setbytea(%2$L), %3$L)";
              encryptSql = XT.format(encryptQuery, [val, encryptionKey, 'bf']);
              val = record[prop] ? plv8.execute(encryptSql)[0].encrypt : null;
              params.values.push(val);
              params.identifiers.push(attr.column);
              params.expressions.push("%" + count + "$I = $" + count);
              isValidSql = true;
              count++;
            } else {
              // TODO - Improve error handling.
              throw new Error("No encryption key provided.");
            }
          } else if (ormp.name !== pkey) {
            if (val === null) {
              if (attr.required) {
                plv8.elog(ERROR, "Attribute " + ormp.name + " is required.");
              } else {
                params.values.push(attr.nullValue || null);
                params.expressions.push("%" + count + "$I = $" + count);
              }
            } else if (ormp.toOne && nkey) {
              if (iorm.table.indexOf(".") > 0) {
                toOneQuery = "select %1$I from %2$I.%3$I where %4$I = $" + count;
                toOneSql = XT.format(toOneQuery, [
                    XT.Orm.primaryKey(iorm, true),
                    iorm.table.beforeDot(),
                    iorm.table.afterDot(),
                    nkey
                  ]);
              } else {
                toOneQuery = "select %1$I from %2$I where %3$I = $" + count;
                toOneSql = XT.format(toOneQuery, [
                    XT.Orm.primaryKey(iorm, true),
                    iorm.table,
                    nkey
                  ]);
              }

              exp = "%" + count + "$I = (" + toOneSql + ")";
              params.values.push(val);
              params.expressions.push(exp);
            } else {
              params.values.push(val);
              params.expressions.push("%" + count + "$I = $" + count);
            }
            params.identifiers.push(attr.column);
            isValidSql = true;
            count++;
          }
        }
      }

      /* Build the update statement */
      expressions = params.expressions.join(', ');
      expressions = XT.format(expressions, params.identifiers);

      // do not send an invalid sql statement
      if (!isValidSql) { return params; }

      if (params.table.indexOf(".") > 0) {
        namespace = params.table.beforeDot();
        table = params.table.afterDot();
        query = 'update %1$I.%2$I set ' + expressions + ' where %3$I = $' + count + ';';
        params.statement = XT.format(query, [namespace, table, columnKey]);
      } else {
        query = 'update %1$I set ' + expressions + ' where %2$I = $' + count + ';';
        params.statement = XT.format(query, [params.table, columnKey]);
      }

      if (DEBUG) {
        XT.debug('prepareUpdate statement =', params.statement);
        XT.debug('prepareUpdate values =', params.values);
      }

      return params;
    },

    /**
     * Commit deletion to the database
     *
     * @param {Object} Options
     * @param {String} [options.nameSpace] Namespace. Required.
     * @param {String} [options.type] Type. Required.
     * @param {Object} [options.data] The data payload to be processed. Required.
     * @param {Number} [options.etag] Optional record id version for optimistic locking.
     *  If set and version does not match, delete will fail.
     * @param {Number} [options.lock] Lock information for pessemistic locking.
     */
    deleteRecord: function (options) {
      var data = options.data,
        orm = this.fetchOrm(options.nameSpace, options.type, {silentError: true}),
        pkey,
        nkey,
        id,
        columnKey,
        etag,
        ext,
        i,
        lockKey = options.lock && options.lock.key ? options.lock.key : false,
        lockTable,
        namespace,
        prop,
        ormp,
        query = '',
        sql = '',
        table,
        values;

      /* Set variables or return false with message. */
      if (!orm) {
        throw new handleError("Not Found", 404);
      }

      pkey = XT.Orm.primaryKey(orm);
      nkey = XT.Orm.naturalKey(orm);
      lockTable = orm.lockTable || orm.table;
      if (!pkey && !nkey) {
        throw new handleError("Not Found", 404);
      }

      id = nkey ? this.getId(orm, data[nkey]) : data[pkey];
      if (!id) {
        throw new handleError("Not Found", 404);
      }

      /* Test for optional optimistic lock. */
      etag = this.getVersion(orm, id);
      if (etag && options.etag && etag !== options.etag) {
        throw new handleError("Precondition Required", 428);
      }

      /* Test for pessemistic lock. */
      if (orm.lockable) {
        lock = this.tryLock(lockTable, id, {key: lockKey});
        if (!lock.key) {
          throw new handleError("Conflict", 409);
        }
      }

      /* Delete children first. */
      for (prop in data) {
        ormp = XT.Orm.getProperty(orm, prop);

        /* If the property is an array of objects they must be records so delete them. */
        if (ormp.toMany && ormp.toMany.isNested) {
          values = data[prop];
          for (var i = 0; i < values.length; i++) {
            this.deleteRecord({
              nameSpace: options.nameSpace,
              type: ormp.toMany.type,
              data: values[i]
            });
          }
        }
      }

      /* Next delete from extension tables. */
      for (var i = 0; i < orm.extensions.length; i++) {
        ext = orm.extensions[i];
        if (ext.table !== orm.table &&
            !ext.isChild) {
          columnKey = ext.relations[0].column;
          nameKey = ext.relations[0].inverse;

          if (ext.table.indexOf(".") > 0) {
            namespace = ext.table.beforeDot();
            table = ext.table.afterDot();
            query = 'delete from %1$I.%2$I where %3$I = $1';
            sql = XT.format(query, [namespace, table, columnKey]);
          } else {
            query = 'delete from %1$I where %2$I = $1';
            sql = XT.format(query, [ext.table, columnKey]);
          }

          if (DEBUG) {
            XT.debug('deleteRecord sql =', sql);
            XT.debug('deleteRecord values =',  [id]);
          }
          plv8.execute(sql, [id]);
        }
      }

      /* Now delete the top. */
      nameKey = XT.Orm.primaryKey(orm);
      columnKey = XT.Orm.primaryKey(orm, true);

      if (orm.table.indexOf(".") > 0) {
        namespace = orm.table.beforeDot();
        table = orm.table.afterDot();
        query = 'delete from %1$I.%2$I where %3$I = $1';
        sql = XT.format(query, [namespace, table, columnKey]);
      } else {
        query = 'delete from %1$I where %2$I = $1';
        sql = XT.format(query, [orm.table, columnKey]);
      }

      /* Commit the record.*/
      if (DEBUG) {
        XT.debug('deleteRecord sql =', sql);
        XT.debug('deleteRecord values =', [id]);
      }
      plv8.execute(sql, [id]);

      /* Release any lock. */
      if (orm.lockable) {
        this.releaseLock({table: lockTable, id: id});
      }
    },

    /**
     * Decrypts properties where applicable.
     *
     * @param {String} name space
     * @param {String} type
     * @param {Object} record
     * @param {Object} encryption key
     * @returns {Object}
     */
    decrypt: function (nameSpace, type, record, encryptionKey) {
      var result,
        that = this,
        hexToAlpha = function (hex) {
          var str = '', i;
          for (i = 2; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          return str;
        },
        orm = this.fetchOrm(nameSpace, type);

      for (prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop.camelize());

        /* Decrypt property if applicable. */
        if (ormp && ormp.attr && ormp.attr.isEncrypted) {
          if (encryptionKey) {
            sql = "select formatbytea(decrypt($1, setbytea($2), 'bf')) as result";
            // TODO - Handle not found error.

            if (DEBUG && false) {
              XT.debug('decrypt prop =', prop);
              XT.debug('decrypt sql =', sql);
              XT.debug('decrypt values =', [record[prop], encryptionKey]);
            }
            result = plv8.execute(sql, [record[prop], encryptionKey])[0].result;
            /* we SOMETIMES need to translate from hex here */
            if(typeof result === 'string' && result.substring(0, 2) === '\\x') {
              result = result ? hexToAlpha(result) : result;
            }
            /* in the special case of encrypted credit card numbers, we don't give the
              user the full decrypted number EVEN IF they have the encryption key */
            if(ormp.attr.isEncrypted === "credit_card_number" && result && result.length >= 4) {
              record[prop] = "************" + result.substring(result.length - 4);
            } else {
              record[prop] = result;
            }
          } else {
            record[prop] = '**********';
          }

        /* Check recursively. */
        } else if (ormp.toOne && ormp.toOne.isNested) {
          that.decrypt(nameSpace, ormp.toOne.type, record[prop], encryptionKey);

        } else if (ormp.toMany && ormp.toMany.isNested) {
          record[prop].map(function (subdata) {
            that.decrypt(nameSpace, ormp.toMany.type, subdata, encryptionKey);
          });
        }
      }

      return record;
    },

    /**
      Fetches the ORM. Caches the result in this data object, where it can be used
      for this request but will be conveniently forgotten between requests.
     */
    fetchOrm: function (nameSpace, type) {
      var res,
        ret,
        recordType = nameSpace + '.'+ type;

      if (!this._maps) {
        this._maps = [];
      }

      res = this._maps.findProperty('recordType', recordType);
      if (res) {
        ret = res.map;
      } else {
        ret = XT.Orm.fetch(nameSpace, type);

        /* cache the result so we don't requery needlessly */
        this._maps.push({ "recordType": recordType, "map": ret});
      }
      return ret;
    },

    /**
     * Get the current database server version.
     * If the optional precision argument is passed, return the first prec
     * fields of the full version number.
     *
     * @example
     * var x   = getPgVersion(1),       // '9'
     *     xy  = getPgVersion(2),       // '9.1'
     *     xyz = getPgVersion(3),       // '9.1.3'
     *     all = getPgVersion();        // '9.1.3'
     *
     * @param   {Number} proc - optional precision
     * @returns {String} X[.Y[.Z]]
     */
    getPgVersion: function (prec) {
      var q = plv8.execute("select setting from pg_settings " +
                           "where name='server_version';"),
          ret;
      ret = q[0].setting;
      if (typeof prec === 'number') {
        ret = ret.split(".").slice(0,prec).join(".");
      }
      return ret;
    },

    /**
     * Get the oid for a given table name.
     *
     * @param {String} table name
     * @returns {Number}
     */
    getTableOid: function (table) {
      var tableName = this.getTableFromNamespacedTable(table).toLowerCase(), /* be generous */
        namespace = this.getNamespaceFromNamespacedTable(table),
        ret,
        sql = "select pg_class.oid::integer as oid " +
             "from pg_class join pg_namespace on relnamespace = pg_namespace.oid " +
             "where relname = $1 and nspname = $2";

      if (DEBUG) {
        XT.debug('getTableOid sql =', sql);
        XT.debug('getTableOid values =', [tableName, namespace]);
      }
      ret = plv8.execute(sql, [tableName, namespace])[0].oid - 0;

      // TODO - Handle not found error.

      return ret;
    },

    /**
     * Get the primary key id for an object based on a passed in natural key.
     *
     * @param {Object} Orm
     * @param {String} Natural key value
     */
    getId: function (orm, value) {
      var ncol = XT.Orm.naturalKey(orm, true),
        pcol = XT.Orm.primaryKey(orm, true),
        query,
        ret,
        sql;

      if (orm.table.indexOf(".") > 0) {
        namespace = orm.table.beforeDot();
        table = orm.table.afterDot();
        query = "select %1$I as id from %2$I.%3$I where %4$I = $1";
        sql = XT.format(query, [pcol, namespace, table, ncol]);
      } else {
        query = "select %1$I as id from %2$I where %3$I = $1";
        sql = XT.format(query, [pcol, orm.table, ncol]);
      }

      if (DEBUG) {
        XT.debug('getId sql =', sql);
        XT.debug('getId values =', [value]);
      }

      ret = plv8.execute(sql, [value]);

      if(ret.length) {
        return ret[0].id;
      } else {
        throw new handleError("Primary Key not found on " + orm.table +
          " where " + ncol + " = " + value, 400);
      }
    },

    getNamespaceFromNamespacedTable: function (fullName) {
      return fullName.indexOf(".") > 0 ? fullName.beforeDot() : "public";
    },

    getTableFromNamespacedTable: function (fullName) {
      return fullName.indexOf(".") > 0 ? fullName.afterDot() : fullName;
    },

    getPgTypeFromOrmType: function (schema, table, column) {
      var sql = "select data_type from information_schema.columns " +
                "where true " +
                "and table_schema = $1 " +
                "and table_name = $2 " +
                "and column_name = $3;",
          pgType,
          values = [schema, table, column];

      if (DEBUG) {
        XT.debug('getPgTypeFromOrmType sql =', sql);
        XT.debug('getPgTypeFromOrmType values =', values);
      }

      pgType = plv8.execute(sql, values);
      pgType = pgType && pgType[0] ? pgType[0].data_type : false;

      return pgType;
    },

    /**
     * Get the natural key id for an object based on a passed in primary key.
     *
     * @param {Object} Orm
     * @param {Number|String} Primary key value
     * @param {Boolean} safe Return the original value instead of erroring if no match is found
     */
    getNaturalId: function (orm, value, safe) {
      var ncol = XT.Orm.naturalKey(orm, true),
        pcol = XT.Orm.primaryKey(orm, true),
        query,
        ret,
        sql;

      if (orm.table.indexOf(".") > 0) {
        namespace = orm.table.beforeDot();
        table = orm.table.afterDot();
        query = "select %1$I as id from %2$I.%3$I where %4$I = $1";
        sql = XT.format(query, [ncol, namespace, table, pcol]);
      } else {
        query = "select %1$I as id from %2$I where %3$I = $1";
        sql = XT.format(query, [ncol, orm.table, pcol]);
      }

      if (DEBUG) {
        XT.debug('getNaturalId sql =', sql);
        XT.debug('getNaturalId values =', [value]);
      }

      ret = plv8.execute(sql, [value]);

      if (ret.length) {
        return ret[0].id;
      } else if (safe) {
        return value;
      } else {
        throw new handleError("Natural Key Not Found: " + orm.nameSpace + "." + orm.type, 400);
      }
    },

    /**
     * Returns the current version of a record.
     *
     * @param {Object} Orm
     * @param {Number|String} Record id
     */
    getVersion: function (orm, id) {
      if (!orm.lockable) { return; }

      var etag,
        oid = this.getTableOid(orm.lockTable || orm.table),
        res,
        sql = 'select ver_etag from xt.ver where ver_table_oid = $1 and ver_record_id = $2;';

      if (DEBUG) {
        XT.debug('getVersion sql = ', sql);
        XT.debug('getVersion values = ', [oid, id]);
      }
      res = plv8.execute(sql, [oid, id]);
      etag = res.length ? res[0].ver_etag : false;

      if (!etag) {
        etag = XT.generateUUID();
        sql = 'insert into xt.ver (ver_table_oid, ver_record_id, ver_etag) values ($1, $2, $3::uuid);';
        // TODO - Handle insert error.

        if (DEBUG) {
          XT.debug('getVersion insert sql = ', sql);
          XT.debug('getVersion insert values = ', [oid, id, etag]);
        }
        plv8.execute(sql, [oid, id, etag]);
      }

      return etag;
    },

    /**
     * Fetch an array of records from the database.
     *
     * @param {Object} Options
     * @param {String} [dataHash.nameSpace] Namespace. Required.
     * @param {String} [dataHash.type] Type. Required.
     * @param {Array} [dataHash.parameters] Parameters
     * @param {Array} [dataHash.orderBy] Order by - optional
     * @param {Number} [dataHash.rowLimit] Row limit - optional
     * @param {Number} [dataHash.rowOffset] Row offset - optional
     * @returns Array
     */
    fetch: function (options) {
      var nameSpace = options.nameSpace,
        type = options.type,
        query = options.query || {},
        encryptionKey = options.encryptionKey,
        orderBy = query.orderBy,
        orm = this.fetchOrm(nameSpace, type),
        table,
        tableNamespace,
        parameters = query.parameters,
        clause = this.buildClause(nameSpace, type, parameters, orderBy),
        i,
        pkey = XT.Orm.primaryKey(orm),
        pkeyColumn = XT.Orm.primaryKey(orm, true),
        nkey = XT.Orm.naturalKey(orm),
        limit = query.rowLimit ? XT.format('limit %1$L', [query.rowLimit]) : '',
        offset = query.rowOffset ? XT.format('offset %1$L', [query.rowOffset]) : '',
        parts,
        ret = {
          nameSpace: nameSpace,
          type: type
        },
        qry,
        ids = [],
        idParams = [],
        counter = 1,
        sqlCount,
        etags,
        sql_etags,
        sql1 = 'select t1.%3$I as id from %1$I.%2$I t1 {joins} where {conditions} group by t1.%3$I{groupBy} {orderBy} {limit} {offset};',
        sql2 = 'select * from %1$I.%2$I where %3$I in ({ids}) {orderBy}';

      /* Validate - don't bother running the query if the user has no privileges. */
      if (!this.checkPrivileges(nameSpace, type)) { return []; }

      tableNamespace = this.getNamespaceFromNamespacedTable(orm.table);
      table = this.getTableFromNamespacedTable(orm.table);

      if (query.count) {
        /* Just get the count of rows that match the conditions */
        sqlCount = 'select count(distinct t1.%3$I) as count from %1$I.%2$I t1 {joins} where {conditions};';
        sqlCount = XT.format(sqlCount, [tableNamespace.decamelize(), table.decamelize(), pkeyColumn]);
        sqlCount = sqlCount.replace('{joins}', clause.joins)
                           .replace('{conditions}', clause.conditions);

        if (DEBUG) {
          XT.debug('fetch sqlCount = ', sqlCount);
          XT.debug('fetch values = ', clause.parameters);
        }

        ret.data = plv8.execute(sqlCount, clause.parameters);
        return ret;
      }

      /* Because we query views of views, you can get inconsistent results */
      /* when doing limit and offest queries without an order by. Add a default. */
      if (limit && offset && (!orderBy || !orderBy.length) && !clause.orderByColumns) {
        /* We only want this on sql1, not sql2's clause.orderBy. */
        clause.orderByColumns = XT.format('order by t1.%1$I', [pkeyColumn]);
      }

      /* Query the model. */
      sql1 = XT.format(sql1, [tableNamespace.decamelize(), table.decamelize(), pkeyColumn]);
      sql1 = sql1.replace('{joins}', clause.joins)
                 .replace('{conditions}', clause.conditions)
                 .replace(/{groupBy}/g, clause.groupByColumns)
                 .replace(/{orderBy}/g, clause.orderByColumns)
                 .replace('{limit}', limit)
                 .replace('{offset}', offset);

      if (DEBUG) {
        XT.debug('fetch sql1 = ', sql1);
        XT.debug('fetch values = ', clause.parameters);
      }

      /* First query for matching ids, then get entire result set. */
      /* This improves performance over a direct query on the view due */
      /* to the way sorting is handled by the query optimizer */
      qry = plv8.execute(sql1, clause.parameters) || [];
      if (!qry.length) { return [] };
      qry.forEach(function (row) {
        ids.push(row.id);
        idParams.push("$" + counter);
        counter++;
      });

      if (orm.lockable) {
        sql_etags = "select ver_etag as etag, ver_record_id as id " +
                    "from xt.ver " +
                    "where ver_table_oid = ( " +
                      "select pg_class.oid::integer as oid " +
                      "from pg_class join pg_namespace on relnamespace = pg_namespace.oid " +
                      /* Note: using $L for quoted literal e.g. 'contact', not an identifier. */
                      "where nspname = %1$L and relname = %2$L " +
                    ") " +
                    "and ver_record_id in ({ids})";
        sql_etags = XT.format(sql_etags, [tableNamespace, table]);
        sql_etags = sql_etags.replace('{ids}', idParams.join());

        if (DEBUG) {
          XT.debug('fetch sql_etags = ', sql_etags);
          XT.debug('fetch etags_values = ', JSON.stringify(ids));
        }
        etags = plv8.execute(sql_etags, ids) || {};
        ret.etags = {};
      }

      sql2 = XT.format(sql2, [nameSpace.decamelize(), type.decamelize(), pkey]);
      sql2 = sql2.replace(/{orderBy}/g, clause.orderBy)
                 .replace('{ids}', idParams.join());

      if (DEBUG) {
        XT.debug('fetch sql2 = ', sql2);
        XT.debug('fetch values = ', JSON.stringify(ids));
      }
      ret.data = plv8.execute(sql2, ids) || [];

      for (var i = 0; i < ret.data.length; i++) {
        ret.data[i] = this.decrypt(nameSpace, type, ret.data[i], encryptionKey);

        if (etags) {
          /* Add etags to result in pkey->etag format. */
          for (var j = 0; j < etags.length; j++) {
            if (etags[j].id === ret.data[i][pkey]) {
              ret.etags[ret.data[i][nkey]] = etags[j].etag;
            }
          }
        }
      }

      this.sanitize(nameSpace, type, ret.data, options);

      return ret;
    },

    /**
    Fetch a metric value.

    @param {String} Metric name
    @param {String} Return type 'text', 'boolean' or 'number' (default 'text')
    */
    fetchMetric: function (name, type) {
      var fn = 'fetchmetrictext';
      if (type === 'boolean') {
        fn = 'fetchmetricbool';
      } else if (type === 'number') {
        fn = 'fetchmetricvalue';
      }
      return plv8.execute("select " + fn + "($1) as resp", [name])[0].resp;
    },

    /**
     * Retreives a record from the database. If the user does not have appropriate privileges an
     * error will be thrown unless the `silentError` option is passed.
     *
     * If `context` is passed as an option then a record will only be returned if it exists in the context (parent)
     * record which itself must be accessible by the effective user.
     *
     * @param {Object} options
     * @param {String} [options.nameSpace] Namespace. Required.
     * @param {String} [options.type] Type. Required.
     * @param {Number} [options.id] Record id. Required.
     * @param {Boolean} [options.superUser=false] If true ignore privilege checking.
     * @param {String} [options.encryptionKey] Encryption key
     * @param {Boolean} [options.silentError=false] Silence errors
     * @param {Object} [options.context] Context
     * @param {String} [options.context.nameSpace] Context namespace.
     * @param {String} [options.context.type] The type of context object.
     * @param {String} [options.context.value] The value of the context's primary key.
     * @param {String} [options.context.relation] The name of the attribute on the type to which this record is related.
     * @returns Object
     */
    retrieveRecord: function (options) {
      options = options ? options : {};
      options.obtainLock = false;

      var id = options.id,
        nameSpace = options.nameSpace,
        type = options.type,
        map = this.fetchOrm(nameSpace, type),
        context = options.context,
        encryptionKey = options.encryptionKey,
        join = "",
        lockTable = map.lockTable || map.table,
        nkey = XT.Orm.naturalKey(map),
        params = {},
        pkey = XT.Orm.primaryKey(map),
        ret = {
          nameSpace: nameSpace,
          type: type,
          id: id
        },
        sql;

      if (!pkey) {
        throw new Error('No key found for {nameSpace}.{type}'
                        .replace("{nameSpace}", nameSpace)
                        .replace("{type}", type));
      }

      /* If this object uses a natural key, go get the primary key id. */
      if (nkey) {
        id = this.getId(map, id);
        if (!id) {
          return false;
        }
      }

      /* Context means search for this record inside another. */
      if (context) {
        context.nameSpace = context.nameSpace || context.recordType.beforeDot();
        context.type = context.type || context.recordType.afterDot()
        context.map = this.fetchOrm(context.nameSpace, context.type);
        context.prop = XT.Orm.getProperty(context.map, context.relation);
        context.pertinentExtension = XT.Orm.getProperty(context.map, context.relation, true);
        context.underlyingTable = context.pertinentExtension.table,
        context.underlyingNameSpace = this.getNamespaceFromNamespacedTable(context.underlyingTable);
        context.underlyingType = this.getTableFromNamespacedTable(context.underlyingTable);
        context.fkey = context.prop.toMany.inverse;
        context.fkeyColumn = context.prop.toMany.column;
        context.pkey = XT.Orm.naturalKey(context.map) || XT.Orm.primaryKey(context.map);
        params.attribute = context.pkey;
        params.value = context.value;

        join = 'join %1$I.%2$I on (%1$I.%2$I.%3$I = %4$I.%5$I)';
        join = XT.format(join, [
            context.underlyingNameSpace,
            context.underlyingType,
            context.fkeyColumn,
            type.decamelize(),
            context.fkey
          ]);
      }

      /* Validate - don't bother running the query if the user has no privileges. */
      if(!options.superUser && !context && !this.checkPrivileges(nameSpace, type)) {
        if (options.silentError) {
          return false;
        } else {
          throw new handleError("Unauthorized", 401);
        }
      }

      ret.etag = this.getVersion(map, id);

      /* Obtain lock if required. */
      if (map.lockable) {
        ret.lock = this.tryLock(lockTable, id, options);
      }

      /* Data sql. */
      sql = 'select %1$I.* from %2$I.%1$I {join} where %1$I.%3$I = $1;';
      sql = sql.replace(/{join}/, join);
      sql = XT.format(sql, [type.decamelize(), nameSpace.decamelize(), pkey]);

      /* Query the map. */
      if (DEBUG) {
        XT.debug('retrieveRecord sql = ', sql);
        XT.debug('retrieveRecord values = ', [id]);
      }
      ret.data = plv8.execute(sql, [id])[0] || {};

      if (!context) {
        /* Check privileges again, this time against record specific criteria where applicable. */
        if(!options.superUser && !this.checkPrivileges(nameSpace, type, ret.data)) {
          if (options.silentError) {
            return false;
          } else {
            throw new handleError("Unauthorized", 401);
          }
        }
        /* Decrypt result where applicable. */
        ret.data = this.decrypt(nameSpace, type, ret.data, encryptionKey);
      }

      this.sanitize(nameSpace, type, ret.data, options);

      /* Return the results. */
      return ret || {};
    },

    /**
     *  Remove unprivileged attributes, primary and foreign keys from the data.
     *  Only removes the primary key if a natural key has been specified in the ORM.
     *  Also format for printing using XT.format functions if printFormat=true'
     *
     * @param {String} Namespace
     * @param {String} Type
     * @param {Object|Array} Data
     * @param {Object} Options
     * @param {Boolean} [options.includeKeys=false] Do not remove primary and foreign keys.
     * @param {Boolean} [options.superUser=false] Do not remove unprivileged attributes.
     * @param {Boolean} [options.printFormat=true] Format for printing.
     */
    sanitize: function (nameSpace, type, data, options) {
      options = options || {};
      if (options.includeKeys && options.superUser) { return; }
      if (XT.typeOf(data) !== "array") { data = [data]; }
      var orm = this.fetchOrm(nameSpace, type),
        pkey = XT.Orm.primaryKey(orm),
        nkey = XT.Orm.naturalKey(orm),
        props = orm.properties,
        attrPriv = orm.privileges && orm.privileges.attribute ?
          orm.privileges.attribute : false,
        inclKeys = options.includeKeys,
        superUser = options.superUser,
        printFormat = options.printFormat,
        c,
        i,
        item,
        n,
        prop,
        itemAttr,
        filteredProps,
        val,
        preOffsetDate,
        offsetDate,
        check = function (p) {
          return p.name === itemAttr;
        };

      for (var c = 0; c < data.length; c++) {
        item = data[c];

        /* Remove primary key if applicable */
        if (!inclKeys && nkey && nkey !== pkey) { delete item[pkey]; }

        for (itemAttr in item) {
          if (!item.hasOwnProperty(itemAttr)) {
            continue;
          }
          filteredProps = orm.properties.filter(check);

          if (filteredProps.length === 0 && orm.extensions.length > 0) {
            /* Try to get the orm prop from an extension if it's not in the core*/
            orm.extensions.forEach(function (ext) {
              if (filteredProps.length === 0) {
                filteredProps = ext.properties.filter(check);
              }
            });
          }

          /* Remove attributes not found in the ORM */
          if (filteredProps.length === 0) {
            delete item[itemAttr];
          } else {
            prop = filteredProps[0];
          }

          /* Remove unprivileged attribute if applicable */
          if (!superUser && attrPriv && attrPriv[prop.name] &&
            (attrPriv[prop.name].view !== undefined) &&
            !this.checkPrivilege(attrPriv[prop.name].view)) {
            delete item[prop.name];
          }

          /*  Format for printing if printFormat and not an object */
          if (printFormat && !prop.toOne && !prop.toMany) {
            switch(prop.attr.type) {
              case "Date":
              case "DueDate":
                preOffsetDate = item[itemAttr];
                offsetDate = preOffsetDate &&
                  new Date(preOffsetDate.valueOf() + 60000 * preOffsetDate.getTimezoneOffset());
                item[itemAttr] = XT.formatDate(offsetDate).formatdate;
              break;
              case "Cost":
                item[itemAttr] = XT.formatCost(item[itemAttr]).formatcost.toString();
              break;
              case "Number":
                item[itemAttr] = XT.formatNumeric(item[itemAttr], "").formatnumeric.toString();
              break;
              case "Money":
                item[itemAttr] = XT.formatMoney(item[itemAttr]).formatmoney.toString();
              break;
              case "SalesPrice":
                item[itemAttr] = XT.formatSalesPrice(item[itemAttr]).formatsalesprice.toString();
              break;
              case "PurchasePrice":
                item[itemAttr] = XT.formatPurchPrice(item[itemAttr]).formatpurchprice.toString();
              break;
              case "ExtendedPrice":
                item[itemAttr] = XT.formatExtPrice(item[itemAttr]).formatextprice.toString();
              break;
              case "Quantity":
                item[itemAttr] = XT.formatQty(item[itemAttr]).formatqty.toString();
              break;
              case "QuantityPer":
                item[itemAttr] = XT.formatQtyPer(item[itemAttr]).formatqtyper.toString();
              break;
              case "UnitRatioScale":
                item[itemAttr] = XT.formatRatio(item[itemAttr]).formatratio.toString();
              break;
              case "Percent":
                item[itemAttr] = XT.formatPrcnt(item[itemAttr]).formatprcnt.toString();
              break;
              case "WeightScale":
                item[itemAttr] = XT.formatWeight(item[itemAttr]).formatweight.toString();
              break;
              default:
                item[itemAttr] = (item[itemAttr] || "").toString();
            }
          }

          /* Handle composite types */
          if (prop.toOne && prop.toOne.isNested && item[prop.name]) {
            this.sanitize(nameSpace, prop.toOne.type, item[prop.name], options);
          } else if (prop.toMany && prop.toMany.isNested && item[prop.name]) {
            for (var n = 0; n < item[prop.name].length; n++) {
              val = item[prop.name][n];

              /* Remove foreign key if applicable */
              if (!inclKeys) { delete val[prop.toMany.inverse]; }
              this.sanitize(nameSpace, prop.toMany.type, val, options);
            }
          }
        }
      }
    },

    /**
     * Returns a array of key value pairs of metric settings that correspond with an array of passed keys.
     *
     * @param {Array} array of metric names
     * @returns {Array}
     */
    retrieveMetrics: function (keys) {
      var literals = [],
        prop,
        qry,
        ret = {},
        sql = 'select metric_name as setting, metric_value as value '
            + 'from metric '
            + 'where metric_name in ({literals})';

      for (var i = 0; i < keys.length; i++) {
        literals[i] = "%" + (i + 1) + "$L";
      }

      sql = sql.replace(/{literals}/, literals.join(','));
      sql = XT.format(sql, keys)

      if (DEBUG) {
        XT.debug('retrieveMetrics sql = ', sql);
      }
      qry = plv8.execute(sql);

      /* Recast where applicable. */
      for (var i = 0; i < qry.length; i++) {
        prop = qry[i].setting;
        if(qry[i].value === 't') { ret[prop] = true; }
        else if(qry[i].value === 'f') { ret[prop] = false }
        else if(!isNaN(qry[i].value)) { ret[prop] = qry[i].value - 0; }
        else { ret[prop] = qry[i].value; }
      }

      /* Make sure there is a result at all times */
      keys.forEach(function (key) {
        if (ret[key] === undefined) { ret[key] = null; }
      });

      return ret;
    },

    /**
     * Creates and returns a lock for a given table. Defaults to a time based lock of 30 seconds
     * unless aternate timeout option or process id (pid) is passed. If a pid is passed, the lock
     * is considered infinite as long as the pid is valid. If a previous lock key is passed and it is
     * valid, a new lock will be granted.
     *
     * @param {String | Number} Table name or oid
     * @param {Number} Record id
     * @param {Object} Options
     * @param {Number} [options.timeout=30]
     * @param {Number} [options.pid] Process id
     * @param {Number} [options.key] Key
     * @param {Boolean} [options.obtainLock=true] If false, only checks for existing lock
     */
    tryLock: function (table, id, options) {
      options = options ? options : {};

      var deleteSql = "delete from xt.lock where lock_id = $1;",
        timeout = options.timeout || 30,
        expires = new Date(),
        i,
        insertSqlExp = "insert into xt.lock (lock_table_oid, lock_record_id, lock_username, lock_expires) " +
                       "values ($1, $2, $3, $4) returning lock_id, lock_effective;",
        insertSqlPid = "insert into xt.lock (lock_table_oid, lock_record_id, lock_username, lock_pid) " +
                       "values ($1, $2, $3, $4) returning lock_id, lock_effective;",
        lock,
        lockExp,
        oid,
        pcheck,
        pgver = 0 + XT.Data.getPgVersion(2),
        pid = options.pid || null,
        pidcol = (pgver < 9.2) ? "procpid" : "pid",
        pidSql = "select usename, {pidcol} " +
                 "from pg_stat_activity " +
                 "where datname=current_database() " +
                 " and usename=$1 " +
                 " and {pidcol}=$2;",
        query,
        selectSql = "select * " +
                    "from xt.lock " +
                    "where lock_table_oid = $1 " +
                    " and lock_record_id = $2;",
        username = XT.username;

      pidSql = pidSql.replace(/{pidcol}/g, pidcol);

      /* If passed a table name, look up the oid. */
      oid = typeof table === "string" ? this.getTableOid(table) : table;

      if (DEBUG) XT.debug("Trying lock table", [oid, id]);

      /* See if there are existing lock(s) for this record. */
      if (DEBUG) {
        XT.debug('tryLock sql = ', selectSql);
        XT.debug('tryLock values = ', [oid, id]);
      }
      query = plv8.execute(selectSql, [oid, id]);

      /* Validate result */
      if (query.length > 0) {
        while (query.length) {
          lock = query.shift();

          /* See if we are confirming our own lock. */
          if (options.key && options.key === lock.lock_id) {
            /* Go on and we'll get a new lock. */

          /* Make sure if they are pid locks users is still connected. */
          } else if (lock.lock_pid) {
            if (DEBUG) {
              XT.debug('tryLock sql = ', pidSql);
              XT.debug('tryLock values = ', [lock.lock_username, lock.lock_pid]);
            }
            pcheck = plv8.execute(pidSql, [lock.lock_username, lock.lock_pid]);
            if (pcheck.length) { break; } /* valid lock */
          } else {
            lockExp = new Date(lock.lock_expires);
            if (DEBUG) { XT.debug("Lock found", [lockExp > expires, lockExp, expires]); }
            if (lockExp > expires) { break; } /* valid lock */
          }

          /* Delete invalid or expired lock. */
          if (DEBUG) {
            XT.debug('tryLock sql = ', deleteSql);
            XT.debug('tryLock values = ', [lock.lock_id]);
          }
          plv8.execute(deleteSql, [lock.lock_id]);
          lock = undefined;
        }

        if (lock) {
          if (DEBUG) XT.debug("Lock found", lock.lock_username);

          return {
            username: lock.lock_username,
            effective: lock.lock_effective
          }
        }
      }

      if (options.obtainLock === false) { return; }

      if (DEBUG) { XT.debug("Creating lock."); }
      if (DEBUG) { XT.debug('tryLock sql = ', insertSqlPid); }

      if (pid) {
        if (DEBUG) { XT.debug('tryLock values = ', [oid, id, username, pid]); }
        lock = plv8.execute(insertSqlPid, [oid, id, username, pid])[0];
      } else {
        expires = new Date(expires.setSeconds(expires.getSeconds() + timeout));
        if (DEBUG) { XT.debug('tryLock values = ', [oid, id, username, expires]); }
        lock = plv8.execute(insertSqlExp, [oid, id, username, expires])[0];
      }

      if (DEBUG) { XT.debug("Lock returned is", lock.lock_id); }

      return {
        username: username,
        effective: lock.lock_effective,
        key: lock.lock_id
      }
    },

    /**
     * Release a lock. Pass either options with a key, or table, id and username.
     *
     * @param {Object} Options: key or table and id
     */
    releaseLock: function (options) {
      var oid,
        sqlKey = 'delete from xt.lock where lock_id = $1;',
        sqlUsr = 'delete from xt.lock where lock_table_oid = $1 and lock_record_id = $2 and lock_username = $3;',
        username = XT.username;

      if (options.key) {
        if (DEBUG) {
          XT.debug('releaseLock sql = ', sqlKey);
          XT.debug('releaseLock values = ', [options.key]);
        }
        plv8.execute(sqlKey, [options.key]);
      } else {
        oid = typeof options.table === "string" ? this.getTableOid(options.table) : options.table;

        if (DEBUG) {
          XT.debug('releaseLock sql = ', sqlUsr);
          XT.debug('releaseLock values = ', [oid, options.id, username]);
        }
        plv8.execute(sqlUsr, [oid, options.id, username]);
      }

      return true;
    },

    /**
     * Renew a lock. Defaults to rewing the lock for 30 seconds.
     *
     * @param {Number} Key
     * @params {Object} Options: timeout
     * @returns {Date} New expiration or false.
     */
    renewLock: function (key, options) {
      var expires = new Date(),
        query,
        selectSql = "select * from xt.lock where lock_id = $1;",
        timeout = options && options.timeout ? options.timeout : 30,
        updateSql = "update xt.lock set lock_expires = $1 where lock_id = $2;";

      if (typeof key !== "number") { return false; }
      expires = new Date(expires.setSeconds(expires.getSeconds() + timeout));

      if (DEBUG) {
        XT.debug('renewLock sql = ', selectSql);
        XT.debug('renewLock values = ', [key]);
      }
      query = plv8.execute(selectSql, [key]);

      if (query.length) {
        if (DEBUG) {
          XT.debug('renewLock sql = ', updateSql);
          XT.debug('renewLock values = ', [expires, key]);
        }
        plv8.execute(updateSql, [expires, key]);

        return true;
      }

      return false;
    }
  }

}());

$$ );
