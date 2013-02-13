-- remove old trigger if any
drop trigger if exists usrgrp_did_change on public.usrgrp;

-- create trigger
create trigger usrgrp_did_change after insert or delete on public.usrgrp for each row execute procedure xt.usrgrp_did_change();





