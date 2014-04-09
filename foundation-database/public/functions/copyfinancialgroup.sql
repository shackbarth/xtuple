CREATE OR REPLACE FUNCTION copyFinancialGroup(INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSourceGroup ALIAS FOR $1;
  pFlheadid ALIAS FOR $2;
  pParentFlgrpid ALIAS FOR $3;

  _flgrpid INTEGER;

BEGIN

  SELECT nextval(''flgrp_flgrp_id_seq'') INTO _flgrpid;

-- Copy the group item
  INSERT INTO flgrp
         (flgrp_id, flgrp_flhead_id, flgrp_flgrp_id,
          flgrp_order, flgrp_name, flgrp_descrip,
          flgrp_subtotal, flgrp_summarize, flgrp_subtract,
          flgrp_showstart, flgrp_showend,
          flgrp_showdelta, flgrp_showbudget, flgrp_showdiff, flgrp_showcustom,
          flgrp_showstartprcnt, flgrp_showendprcnt,
          flgrp_showdeltaprcnt, flgrp_showbudgetprcnt, flgrp_showdiffprcnt, flgrp_showcustomprcnt,
          flgrp_usealtsubtotal, flgrp_altsubtotal,flgrp_prcnt_flgrp_id)
  SELECT _flgrpid, pFlheadid, pParentFlgrpid,
         flgrp_order, flgrp_name, flgrp_descrip,
         flgrp_subtotal, flgrp_summarize, flgrp_subtract,
         flgrp_showstart, flgrp_showend,
         flgrp_showdelta, flgrp_showbudget, flgrp_showdiff, flgrp_showcustom,
         flgrp_showstartprcnt, flgrp_showendprcnt,
         flgrp_showdeltaprcnt, flgrp_showbudgetprcnt, flgrp_showdiffprcnt, flgrp_showcustomprcnt,
         flgrp_usealtsubtotal, flgrp_altsubtotal,flgrp_prcnt_flgrp_id
    FROM flgrp
   WHERE (flgrp_id=pSourceGroup);

-- Store temporary cross ref info
   
   EXECUTE '' INSERT INTO tmp_flgrpxref'' || getEffectiveXtUser() || '' (flgrpxref_oldid,flgrpxref_newid) VALUES ('' || pSourceGroup || '','' || _flgrpid || '');'';

-- Copy any children flitems
  INSERT INTO flitem
         (flitem_flhead_id, flitem_flgrp_id,
          flitem_order, flitem_accnt_id, flitem_showstart,
          flitem_showend, flitem_showdelta, flitem_showbudget, flitem_showdiff, flitem_showcustom,
          flitem_subtract, flitem_showstartprcnt,
          flitem_showendprcnt, flitem_showdeltaprcnt,
          flitem_showbudgetprcnt, flitem_showdiffprcnt, flitem_showcustomprcnt,
          flitem_custom_source, flitem_company, flitem_profit, flitem_number,
          flitem_sub, flitem_type, flitem_subaccnttype_code, flitem_prcnt_flgrp_id)
  SELECT pFlheadid, _flgrpid,
         flitem_order, flitem_accnt_id, flitem_showstart,
         flitem_showend, flitem_showdelta, flitem_showbudget, flitem_showdiff, flitem_showcustom,
         flitem_subtract, flitem_showstartprcnt,
         flitem_showendprcnt, flitem_showdeltaprcnt,
         flitem_showbudgetprcnt, flitem_showdiffprcnt, flitem_showcustomprcnt,
         flitem_custom_source, flitem_company, flitem_profit, flitem_number,
          flitem_sub, flitem_type, flitem_subaccnttype_code, flitem_prcnt_flgrp_id
    FROM flitem
   WHERE (flitem_flgrp_id=pSourceGroup);

-- Copy any children flspecs
  INSERT INTO flspec
         (flspec_flhead_id, flspec_flgrp_id,
          flspec_order, flspec_name, flspec_type, flspec_showstart,
          flspec_showend, flspec_showdelta, flspec_showbudget, flspec_showdiff, flspec_showcustom,
          flspec_subtract, flspec_showstartprcnt,
          flspec_showendprcnt, flspec_showdeltaprcnt,
          flspec_showbudgetprcnt, flspec_showdiffprcnt, flspec_showcustomprcnt,
          flspec_custom_source, flspec_prcnt_flgrp_id)
  SELECT pFlheadid, _flgrpid,
         flspec_order, flspec_name, flspec_type, flspec_showstart,
         flspec_showend, flspec_showdelta, flspec_showbudget, flspec_showdiff, flspec_showcustom,
         flspec_subtract, flspec_showstartprcnt,
         flspec_showendprcnt, flspec_showdeltaprcnt,
         flspec_showbudgetprcnt, flspec_showdiffprcnt, flspec_showcustomprcnt,
         flspec_custom_source, flspec_prcnt_flgrp_id
    FROM flspec
   WHERE (flspec_flgrp_id=pSourceGroup);

-- Copy the groups
  PERFORM copyFinancialGroup(flgrp_id, pFlheadid, _flgrpid)
     FROM flgrp
    WHERE (flgrp_flgrp_id=pSourceGroup);

  RETURN _flgrpid;
END;
' LANGUAGE 'plpgsql';
