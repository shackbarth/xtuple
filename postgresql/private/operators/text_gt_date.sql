drop operator if exists > (
  text,
  date
);

create operator > (
  leftarg = text,
  rightarg = date,
  procedure = private.text_gt_date,
  hashes, merges
);
