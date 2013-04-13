drop trigger if exists quhead_did_change on quhead;
create trigger quhead_did_change after insert or update or delete on quhead for each row execute procedure xt.record_did_change();