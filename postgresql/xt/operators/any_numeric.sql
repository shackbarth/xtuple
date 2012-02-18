drop operator if exists <@ (
  numeric,
  numeric[]
);

create operator <@ (
  leftarg = numeric,
  rightarg = numeric[],
  procedure = xt.any_numeric,
  hashes, merges
);
