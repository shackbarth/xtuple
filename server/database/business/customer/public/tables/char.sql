select dropIfExists('TRIGGER', 'customer_sync_char_to_charroleass', 'public');
create trigger customer_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.customer_sync_char_to_charroleass();
