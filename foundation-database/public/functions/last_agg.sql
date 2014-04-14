
-- Create a function that always returns the last non-NULL item
CREATE OR REPLACE FUNCTION public.last_agg ( anyelement, anyelement )
RETURNS anyelement AS $$
  SELECT $2;
$$ LANGUAGE SQL STABLE;

-- And then wrap an aggreagate around it
DROP AGGREGATE public.last(anyelement);
CREATE AGGREGATE public.last (
        sfunc    = public.last_agg,
        basetype = anyelement,
        stype    = anyelement
);

