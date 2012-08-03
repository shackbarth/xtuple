drop operator if exists ~^ (
  text,
  text
);

create operator ~^ (
  leftarg = TEXT,
  rightarg = TEXT,
  procedure = xt.begins_with,
  hashes, merges
);
