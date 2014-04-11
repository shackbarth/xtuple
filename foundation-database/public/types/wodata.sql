SELECT dropIfExists('FUNCTION', 'indentedwo(integer, integer, integer, boolean, boolean)');
SELECT dropIfExists('FUNCTION', 'indentedwo(integer, boolean, boolean, boolean)');
SELECT dropIfExists('FUNCTION', 'indentedwo(integer, boolean, boolean)');
SELECT dropIfExists('FUNCTION', 'indentedwomatl(integer, integer, integer)');
SELECT dropIfExists('FUNCTION', 'indentedwomatl(integer, integer)');
SELECT dropIfExists('FUNCTION', 'indentedwoops(integer, integer);', 'xtmfg');
SELECT dropIfExists('TYPE', 'wodata');

CREATE TYPE wodata AS
   (wodata_id integer,
    wodata_id_type integer,
    wodata_number integer,
    wodata_subnumber integer,
    wodata_itemnumber text,
    wodata_descrip text,
    wodata_status character(1),
    wodata_startdate date,
    wodata_duedate date,
    wodata_adhoc boolean,
    wodata_itemsite_id integer,
    wodata_listprice numeric,
    wodata_custprice numeric,
    wodata_qoh numeric,
    wodata_short numeric,
    wodata_qtyper numeric,
    wodata_qtyiss numeric,
    wodata_qtyrcv numeric,
    wodata_qtyordreq numeric,
    wodata_qtyuom text,
    wodata_scrap numeric,
    wodata_setup numeric,
    wodata_run numeric,
    wodata_notes text,
    wodata_ref text,
    wodata_level integer);
