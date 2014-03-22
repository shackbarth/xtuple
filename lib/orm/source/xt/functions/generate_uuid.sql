/**
    Generate a universally unique identifier.

    @returns {uuid}
*/
create or replace function xt.generate_uuid() returns text as $$

  plv8.elog(WARNING, ("The xt.generate_uuid() function is depricated, use xt.uuid_generate_v4()."))

  return XT.generateUUID();

$$ language plv8;
