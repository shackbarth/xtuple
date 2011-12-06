select dropIfExists('TRIGGER', 'opportunity_sync_char_to_charroleass', 'public');
create trigger opportunity_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.opportunity_sync_char_to_charroleass();
