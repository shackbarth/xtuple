-- auto workflow generation trigger
drop trigger if exists towf_after_insert on tohead;
create trigger towf_after_insert after insert on tohead for each row
  execute procedure xt.createwf_after_insert();

ALTER TABLE tohead DISABLE TRIGGER towf_after_insert;