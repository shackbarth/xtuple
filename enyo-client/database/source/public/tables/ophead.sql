-- trigger
drop trigger if exists ophead_owner_change on ophead;
create trigger ophead_owner_change after insert on ophead for each row execute procedure xt.owner_record_did_change();
