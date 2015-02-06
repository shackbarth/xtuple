do $$

  // Create or update the xt package record to accommodate GUI client scripts
  var version = '1.1.0',
    select = "select pkghead_id from pkghead where pkghead_name = 'xt';",
    insert = "insert into pkghead (pkghead_name, pkghead_descrip, pkghead_developer, pkghead_version, pkghead_notes, pkghead_created, pkghead_updated, pkghead_indev) " +
             "values ('xt', 'xTuple MobileWeb', 'xtuple', $1, '', now(), now(), false)",
    update = 'update pkghead set pkghead_version = $1 where pkghead_id = $2;',
    row = plv8.execute(select)[0];
    
    if (row && row.pkghead_id) {
      plv8.execute(update, [version, row.pkghead_id]);
    } else {
      plv8.execute(insert, [version]);
    }
    
    return true;
    
$$ language plv8;
