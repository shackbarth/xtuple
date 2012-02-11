drop operator if exists <@ (
  numeric,
  numeric[]
);

create operator <@ (
  leftarg = numeric,
  rightarg = numeric[],
  procedure = private.any_numeric,
  hashes, merges
);
