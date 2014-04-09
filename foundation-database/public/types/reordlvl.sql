SELECT dropIfExists('FUNCTION', 'updatereorderlevel(integer[], integer, boolean, integer[])');
SELECT dropIfExists('TYPE', 'reordlvl');

CREATE TYPE reordlvl AS (
    reordlvl_itemsite_id 	integer,
    reordlvl_item_id 		integer,
    reordlvl_warehous_code 	text,
    reordlvl_item_number 	text,
    reordlvl_item_descrip 	text,
    reordlvl_leadtime		integer,
    reordlvl_daysofstock	integer,
    reordlvl_curr_level 	numeric,
    reordlvl_total_days 	numeric,
    reordlvl_total_usage	numeric,
    reordlvl_calc_level 	integer );
