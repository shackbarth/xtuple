-- table definition
-- GUI app. still requires module column.
-- This adds that back.
drop view if exists xc.priv cascade;
create or replace view xc.priv as

select t.*, p.priv_module
from xt.priv t
  join public.priv p on (t.priv_id = p.priv_id);

grant all on table xc.priv to xtrole;
