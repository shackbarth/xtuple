-- Remove invalid data
delete from grppriv where grppriv_priv_id not in (select priv_id from priv);
