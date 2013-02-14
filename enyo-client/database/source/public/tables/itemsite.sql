-- We have to set defaults here so modular ORM technique will work.

alter table public.itemsite alter column itemsite_qtyonhand set default 0;
alter table public.itemsite alter column itemsite_reorderlevel set default 0;
alter table public.itemsite alter column itemsite_ordertoqty set default 0;
alter table public.itemsite alter column itemsite_cyclecountfreq set default 0;
alter table public.itemsite alter column itemsite_datelastused set default startoftime();
alter table public.itemsite alter column itemsite_loccntrl set default false;
alter table public.itemsite alter column itemsite_safetystock set default 0;
alter table public.itemsite alter column itemsite_qtyonhand set default 0;
alter table public.itemsite alter column itemsite_minordqty set default 0;
alter table public.itemsite alter column itemsite_multordqty set default 0;
alter table public.itemsite alter column itemsite_leadtime set default 0;
alter table public.itemsite alter column itemsite_abcclass set default 'A';
alter table public.itemsite alter column itemsite_controlmethod set default 'N';
alter table public.itemsite alter column itemsite_eventfence set default 10;
alter table public.itemsite alter column itemsite_sold set default false;
alter table public.itemsite alter column itemsite_stocked set default false;
alter table public.itemsite alter column itemsite_useparams set default false;
alter table public.itemsite alter column itemsite_useparamsmanual set default false;
alter table public.itemsite alter column itemsite_createpr set default false;
alter table public.itemsite alter column itemsite_value set default 0;
alter table public.itemsite alter column itemsite_location_id set default -1;
alter table public.itemsite alter column itemsite_perishable set default false;
alter table public.itemsite alter column itemsite_autoabcclass set default false;
alter table public.itemsite alter column itemsite_costmethod set default 'N';
alter table public.itemsite alter column itemsite_value set default 0;
alter table public.itemsite alter column itemsite_planning_type set default 'N';

