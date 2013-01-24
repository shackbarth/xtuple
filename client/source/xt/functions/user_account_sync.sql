create or replace function xt.user_account_sync(data_hash text) returns void as $$
  /* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  /** 
    Synchronize a User Account with attributes from a global user. Will create
    PostgreSQL user and associate it with a group if necessary.

    @param {Object} data_hash
    @param {String} data_hash.username 
    @param {String} data_hash.group 
    @param {String} data_hash.active
    @param {String} data_hash.properame
    @param {String} data_hash.email
  */
  var attrs = JSON.parse(data_hash),
    findPgUser = 'select usename from pg_user where usename = $1',
    createPgUser = 'create user "' + attrs.username + '" createrole in group ' + attrs.group + ';',
    findXtUser = 'select useracct_username from xt.useracct where useracct_username = $1',
    defaultLocale = "(select coalesce((select locale_id from locale where lower(locale_code) = 'default' limit 1), " +
      "(select locale_id from locale order by locale_id limit 1))) ",
    createXtUser = 'insert into xt.useracct ' +
      ' (useracct_username, useracct_active, useracct_propername, useracct_initials, ' + 
      ' useracct_email, useracct_locale_id, useracct_disable_export) ' +
      ' values ($1, $2, $3, \'\', $4, ' + defaultLocale + ', false);' +
      'select setuserpreference($1, \'UseEnhancedAuthentication\', \'t\');',
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
  plv8.execute(sql, [attrs.username, attrs.active, attrs.propername, attrs.email]);
  
$$ language plv8;

