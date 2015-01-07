-- Remove invalid data
delete from usrpriv where usrpriv_priv_id not in (select priv_id from priv);

