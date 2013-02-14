create or replace function xt.install_guiscript(script_name text, source text) returns boolean volatile as $$

  var select = "select script_id from xt.pkgscript where script_name = $1;",
    insert = "insert into xt.pkgscript (script_name, script_order, script_enabled, script_source, script_notes) values ($1, 0, true, $2, '')",
    update = 'update xt.pkgscript set script_source = $1 where script_id = $2;',
    row = plv8.execute(select, [script_name])[0];
    
    if (row && row.script_id) {
      plv8.execute(update, [source, row.script_id]);
    } else {
      plv8.execute(insert, [script_name, source]);
    }
    
    return true;
    
$$ language plv8;
