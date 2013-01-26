-- remove old trigger if any
drop trigger if exists itemsitebeforetriggerxt on public.itemsite;

-- create trigger
create trigger itemsitebeforetriggerxt before insert or update on public.itemsite for each row execute procedure xt.itemsitebeforetriggerxt();





