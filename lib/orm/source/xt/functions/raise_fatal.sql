/**
 * Raise a fatal error.
 *
 * This is not currently supported in plv8, but we have an open issue on it:
 * https://code.google.com/p/plv8js/issues/detail?id=72
 *
 * Example: select xt.raise_fatal('you broke it');
 */
create or replace function xt.raise_fatal(message text default null) returns void as $$

  plv8.elog(FATAL, message);

$$ language plv8;

/**
 * If plv8 says NO, we can use Pl/Tcl:
 *
 * This is a Tcl function that will do the same. We use Tcl because it's the
 * only "trusted" language with FATAL support. Setup the server for this with:
 *   sudo apt-get install postgresql-pltcl
 * Run this query on the database:
 *   create language pltcl;
 */

/*
create or replace function xt.raise_fatal(message text default null) returns void AS $$

  elog FATAL $1;

$$ language pltcl;
*/
