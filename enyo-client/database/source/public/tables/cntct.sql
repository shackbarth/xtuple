-- trigger
drop trigger if exists cntct_owner_change on cntct;
create trigger cntct_owner_change after insert on cntct for each row execute procedure xt.owner_record_did_change();
