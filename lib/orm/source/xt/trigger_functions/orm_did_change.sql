create or replace function xt.orm_did_change() returns trigger as $$

  var view, views = [], i = 1, res, n;


  /* Don't bother updating if nothing has changed */
  if (TG_OP === 'UPDATE' && NEW && OLD && NEW.orm_json === OLD.orm_json) {
    
    /* It's possible that the view has been dropped even if the XM.Orm table is still there */
    /* If the view has been dropped, we want to install it */ 
    var viewType = NEW.orm_type.decamelize();
    var viewNsp = NEW.orm_namespace.decamelize();
    var viewCountSql = "select count(*) as count " +
      "from pg_class c " + 
      "join pg_namespace n on (c.relnamespace=n.oid) " +
      "where nspname like $1 " +
      "and relname like $2";
    plv8.elog(NOTICE, viewCountSql, viewNsp, viewType);
    var viewCount = plv8.execute(viewCountSql, [viewNsp, viewType]);
    if(viewCount[0].count > 0) {
      plv8.elog(NOTICE, "***View is already here!!!");
      return NEW; 
    } else {

      plv8.elog(NOTICE, "***View has been dropped!!!", JSON.stringify(viewCount));
    }
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
          orm = XT.Orm.fetch(nameSpace, type, true);
          
      XT.Orm.createView(orm);
    }
  }

  /* Finish up */
  if(TG_OP === 'DELETE') return OLD;
  
  return NEW;

$$ language plv8;
