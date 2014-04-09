CREATE OR REPLACE FUNCTION bomitem(INTEGER) RETURNS SETOF bomitem AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT * FROM bomitem WHERE ((bomitem_parent_item_id=$1) AND (bomitem_rev_id=getActiveRevId('BOM',$1)));
$$ LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION bomitem(INTEGER,INTEGER) RETURNS SETOF bomitem AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT * FROM bomitem WHERE ((bomitem_parent_item_id=$1) AND (bomitem_rev_id=$2));
$$ LANGUAGE 'sql';
