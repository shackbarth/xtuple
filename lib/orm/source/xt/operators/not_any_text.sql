drop operator if exists !<@ (
  text,
  text[]
);

create operator !<@ (
  leftarg = text,
  rightarg = text[],
  procedure = xt.not_any_text,
  hashes, merges
);