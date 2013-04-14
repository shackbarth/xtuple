create or replace function xt.orm_did_change() returns trigger as $$

  var view,
    views = [],
    lockTable,
    tableName,
    i = 1,
    sql,
    res,
    n;


  /* Don't bother updating if nothing has changed */
  if (TG_OP === 'UPDATE' && NEW && OLD && NEW.orm_json === OLD.orm_json) {
    return NEW;
  }

  /* Validate */
  if(TG_OP === 'INSERT' || TG_OP === 'UPDATE') {
    view = NEW.orm_namespace.decamelize() + '.' + NEW.orm_type.decamelize();
  } else {
    view = OLD.orm_namespace.decamelize() + '.' + OLD.orm_type.decamelize();
  }

  /* determine view dependencies */
  views = XT.Orm.viewDependencies(view);

  /* drop the views */
  n = views.length;
  while (n--) {
    nsp = views[n].beforeDot();
    rel = views[n].afterDot();
    plv8.execute("drop view if exists " + nsp + "." + rel);
    if (rel.indexOf("_") !== 0) {
      plv8.execute("drop view if exists " + nsp + "._" + rel);
    }
  }

  /* Determine whether to rebuild */ 
  if(TG_OP === 'UPDATE' || TG_OP === 'DELETE') {
    if(!OLD.orm_ext) { /* is base map */ 
      if(TG_OP === 'DELETE') {
        views.splice(views.indexOf(view), 1);
        if(views.length) {
          throw new Error('Can not delete map for view {view} because it has the following dependencies: {views}'
                          .replace(/{view}/, view)
                          .replace(/{views}/, views.join(',')));
        } else {
          return OLD;
        }
      } else if(TG_OP === 'UPDATE' && !NEW.orm_active) {
        views.splice(views.indexOf(view), 1);
        if(views.length) {
          throw new Error('Can not deactivate map {type} because it has the following dependencies: {views}'
                          .replace(/{type}/, NEW.orm_type)
                          .replace(/{views}/, views.join(',')));
        } else {
          return OLD;
        }
      }
    }
  }

  /* Loop through model names and create */ 
  if(TG_OP === 'INSERT' || TG_OP === 'UPDATE') {
    for(var i = 0; i < views.length; i++) {
      var nameSpace = views[i].beforeDot().camelize().toUpperCase(),
          type = views[i].afterDot().classify(),
          orm;
      if (type.indexOf("_") !== 0) { 
        orm = XT.Orm.fetch(nameSpace, type, true);
        XT.Orm.createView(orm);
      }
    }
  }

  /* Finish up */
  if (TG_OP === 'DELETE') {
    orm = JSON.parse(OLD.orm_json);
    lockTable = orm.lockTable || orm.table;
    tableName =  lockTable.indexOf(".") === -1 ? lockTable : lockTable.afterDot(); 
    sql = 'drop trigger if exists {tableName}_did_change on {table};'
          .replace(/{tableName}/, tableName)
          .replace(/{table}/, lockTable);
    plv8.execute(sql);
    return OLD;
  }

  return NEW;

$$ language plv8;
