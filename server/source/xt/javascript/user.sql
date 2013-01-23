select xt.install_js('XM','User','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.User = {};
  
  XM.User.isDispatchable = true;

  /** 
    Pass in a record type and get the next id for that type 

    @param {String} record type
    @returns Number
  */
  XM.User.sync = function(attrs) { 
    var findPgUser = 'select usename from pg_user where usename = $1',
      createPgUser = 'create user "' + attrs.username + '" createrole in group ' + attrs.group + ';',
      findXtUser = 'select useracct_username from xt.useracct where useracct_username = $1',
      defaultLocale = "(select coalesce((select locale_id from locale where lower(locale_code) = 'default' limit 1), " +
        "(select locale_id from locale order by locale_id limit 1))) ",
      createXtUser = 'insert into xt.useracct ' +
        ' (useracct_username, useracct_active, useracct_propername, useracct_initials, ' + 
        ' useracct_email, useracct_locale_id, useracct_disable_export) ' +
        ' values ($1, $2, $3, \'\', $4, ' + defaultLocale + ', false);',
      updateXtUser = 'update xt.useracct set' +
        ' useracct_active = $2,' +
        ' useracct_propername = $3, ' +
        ' useracct_email = $4 ' +
        'where useracct_username = $1;',
      pgUser = plv8.execute(findPgUser, [attrs.username]),
      xtUser = plv8.execute(findXtUser, [attrs.username]),
      sql;

    if (!pgUser.length) {
      plv8.execute(createPgUser);
    }

    sql = xtUser.length ? updateXtUser : createXtUser;
    plv8.execute(sql, [attrs.username, attrs.active, attrs.propername, attrs.email])
  }
  
$$ );

