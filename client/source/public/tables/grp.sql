-- remove old trigger if any
drop trigger if exists grp_did_change on public.grp;

-- create trigger
create trigger grp_did_change after insert or update or delete on public.grp for each row execute procedure xt.grp_did_change();





