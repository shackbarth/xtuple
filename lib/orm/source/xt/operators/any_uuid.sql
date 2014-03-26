drop operator if exists <@ (
  uuid,
  uuid[]
);

create operator <@ (
  leftarg = uuid,
  rightarg = uuid[],
  procedure = xt.any_uuid,
  hashes, merges
);
