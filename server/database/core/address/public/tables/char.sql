select dropIfExists('TRIGGER', 'address_sync_char_to_charroleass', 'public');
create trigger address_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.address_sync_char_to_charroleass();
