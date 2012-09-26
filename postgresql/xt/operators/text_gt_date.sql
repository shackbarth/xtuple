drop operator if exists > (
  text,
  date
);

create operator > (
  leftarg = text,
  rightarg = date,
  procedure = xt.text_gt_date,
  hashes, merges
);
