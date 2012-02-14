drop operator if exists < (
  text,
  date
);

create operator < (
  leftarg = text,
  rightarg = date,
  procedure = private.text_lt_date,
  hashes, merges
);
