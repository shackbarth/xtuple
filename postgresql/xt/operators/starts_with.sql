drop operator if exists ~^ (
  text,
  text
);

create operator ~^ (
  leftarg = TEXT,
  rightarg = TEXT,
  procedure = private.starts_with,
  hashes, merges
);
