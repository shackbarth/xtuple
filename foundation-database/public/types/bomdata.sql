SELECT dropIfExists('FUNCTION', 'indentedBom(integer,integer,integer,integer)', 'public');
SELECT dropIfExists('FUNCTION', 'singleLevelBom(integer,integer,integer,integer)', 'public');
SELECT dropIfExists('FUNCTION', 'summarizedBom(integer,integer,integer,integer)', 'public');
SELECT dropIfExists('TYPE', 'bomdata', 'public');

CREATE TYPE bomdata AS (
  bomdata_bomwork_id		integer,
  bomdata_bomwork_parent_id	integer,
  bomdata_bomwork_level		integer,
  bomdata_bomwork_seqnumber	integer,
  bomdata_bomitem_id		integer,
  bomdata_item_id		integer,
  bomdata_item_number		text,
  bomdata_uom_name		text,
  bomdata_item_descrip1		text,
  bomdata_item_descrip2		text,
  bomdata_itemdescription	text,
  bomdata_batchsize		numeric,
  bomdata_qtyfxd		numeric,
  bomdata_qtyper		numeric,
  bomdata_qtyreq		numeric,
  bomdata_scrap		        numeric,
  bomdata_createchild		bool,
  bomdata_issuemethod		text,
  bomdata_effective		date,
  bomdata_expires		date,
  bomdata_expired		boolean,
  bomdata_future	        boolean,
  bomdata_actunitcost		numeric,
  bomdata_stdunitcost		numeric,
  bomdata_actextendedcost	numeric,
  bomdata_stdextendedcost	numeric,
  bomdata_ecn		        text,
  bomdata_char_id		integer,
  bomdata_value		        text,
  bomdata_notes			text,
  bomdata_ref			text
  );
