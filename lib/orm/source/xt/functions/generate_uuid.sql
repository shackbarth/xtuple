DO $$
  if (!plv8.XT) { plv8.execute('select xt.js_init();'); }
$$ language plv8;

/**
    Generate a universally unique identifier.
    
    @returns {text}
*/
create or replace function xt.generate_uuid() returns text as $$

  return XT.generateUUID();

$$ language plv8;