/**
    Generate a universally unique identifier.
    
    @returns {text}
*/
create or replace function xt.generate_uuid() returns text as $$

  return XT.generateUUID();

$$ language plv8;