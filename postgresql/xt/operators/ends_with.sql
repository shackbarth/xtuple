drop operator if exists ~? (
  text,
  text
);

create operator ~? (
  leftarg = text,
  rightarg = text,
  procedure = xt.ends_with,
  hashes, merges
);
