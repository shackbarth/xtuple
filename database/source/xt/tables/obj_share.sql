-- This table is defined in lib/orm/source/xt/tables/obj_share.sql for load order to work correctly.
-- create trigger
drop trigger if exists obj_share_after on xt.obj_share;
create trigger obj_share_after after insert or update or delete on xt.obj_share for each row execute procedure xt.refresh_obj_share_cache();
