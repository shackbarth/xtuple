create operator <@ (
  leftarg = text,
  rightarg = text[],
  procedure = private.any_text,
  hashes, merges
);
