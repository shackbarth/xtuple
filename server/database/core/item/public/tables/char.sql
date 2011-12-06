select dropIfExists('TRIGGER', 'item_sync_char_to_charroleass', 'public');
create trigger item_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.item_sync_char_to_charroleass();
