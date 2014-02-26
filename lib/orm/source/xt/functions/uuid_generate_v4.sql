/**
    Generate a universally unique identifier.

    @returns {text}
*/
create or replace function xt.uuid_generate_v4() returns uuid as $$

  /* TODO: Consider using uuid-ossp extension instead. */
  /* http://www.postgresql.org/docs/9.1/static/uuid-ossp.html */
  /* CREATE EXTENSION "uuid-ossp"; */

  return XT.generateUUID();

$$ language plv8;
