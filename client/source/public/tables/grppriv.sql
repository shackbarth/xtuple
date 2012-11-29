-- remove old trigger if any
drop trigger if exists grppriv_did_change on public.grppriv;

-- create trigger
create trigger grppriv_did_change after insert or delete on public.grppriv for each row execute procedure xt.grppriv_did_change();





