create or replace function xt.customer_did_change() returns trigger as $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
declare
  _id integer;
begin
  -- This is to handle the situation where a customer might be a prospect
  -- but the web client doesn't know anything about internal database ids
  -- so we have to sort it out after the fact.
  if (TG_OP = 'INSERT') then
    if (new.cust_id is null) then
      select prospect_id into _id
      from prospect 
      where prospect_number=new.cust_number;

      if (_id is not null) then
        new.cust_id = _id;
      else
        new.cust_id = nextval('cust_cust_id_seq');
      end if;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;
