drop operator if exists < (
  text,
  date
);

create operator < (
  leftarg = text,
  rightarg = date,
  procedure = xt.text_lt_date,
  hashes, merges
);
