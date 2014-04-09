
CREATE OR REPLACE FUNCTION findSpecialFinancial(TEXT, TEXT, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUnit ALIAS FOR $1;
  pType ALIAS FOR $2;
  pPeriodid ALIAS FOR $3;

  _value NUMERIC;
BEGIN

  _value := 0.00;

  IF (''OpenAR'' = pType) THEN
    IF ( pUnit IN (''D'',''E'') ) THEN
      SELECT SUM( CASE WHEN (aropen_doctype IN (''C'', ''R'')) THEN ((aropen_amount - aropen_paid) * -1)
                       ELSE (aropen_amount - aropen_paid) END ) INTO _value
        FROM aropen, period
       WHERE ((aropen_open)
         AND  (aropen_duedate BETWEEN period_start AND period_end)
         AND  (period_id=pPeriodid));

      IF (''E'' = pUnit) THEN
        _value := 0.00 - _value;
      END IF;
    END IF;
  END IF;

  IF (''OpenAP'' = pType) THEN
    IF ( pUnit IN (''C'',''E'') ) THEN
      SELECT SUM( CASE WHEN (apopen_doctype=''C'') THEN ((apopen_amount - apopen_paid) * -1)
                       ELSE (apopen_amount - apopen_paid) END ) INTO _value
        FROM apopen, period
       WHERE ((apopen_open)
         AND  (apopen_duedate BETWEEN period_start AND period_end)
         AND  (period_id=pPeriodid));
    END IF;
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION copyFinancialLayout(INTEGER, TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSourceFlheadid ALIAS FOR $1;
  pDestName ALIAS FOR $2;

  _flheadid INTEGER;
  _tblName TEXT;

BEGIN

-- Check for the flhead to be copy that it exists
  PERFORM flhead_id
     FROM flhead
    WHERE (flhead_id=pSourceFlheadid);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

-- Check that the name is valid
  IF (pDestName IS NULL OR pDestName = '''') THEN
    RETURN -2;
  END IF;

-- Check for the name to copy to does not exist
  PERFORM flhead_id
     FROM flhead
    WHERE (flhead_name=pDestName);
  IF (FOUND) THEN
    RETURN -3;
  END IF;

-- Copy the flhead record
  SELECT nextval(''flhead_flhead_id_seq'') INTO _flheadid;
  INSERT INTO flhead
         (flhead_id, flhead_name, flhead_descrip,
          flhead_showtotal, flhead_showstart,
          flhead_showend, flhead_showdelta, flhead_showbudget,
          flhead_showdiff, flhead_showcustom,
          flhead_custom_label,
          flhead_usealttotal, flhead_alttotal,
          flhead_usealtbegin, flhead_altbegin,
          flhead_usealtend, flhead_altend,
          flhead_usealtdebits, flhead_altdebits,
          flhead_usealtcredits, flhead_altcredits,
          flhead_usealtbudget, flhead_altbudget,
          flhead_usealtdiff, flhead_altdiff,
          flhead_type, flhead_active, flhead_sys
)
  SELECT _flheadid, pDestName, flhead_descrip,
         flhead_showtotal, flhead_showstart,
         flhead_showend, flhead_showdelta, flhead_showbudget,
         flhead_showdiff, flhead_showcustom,
         flhead_custom_label,
         flhead_usealttotal, flhead_alttotal,
         flhead_usealtbegin, flhead_altbegin,
         flhead_usealtend, flhead_altend,
         flhead_usealtdebits, flhead_altdebits,
         flhead_usealtcredits, flhead_altcredits,
         flhead_usealtbudget, flhead_altbudget,
         flhead_usealtdiff, flhead_altdiff,
         flhead_type, flhead_active, false
    FROM flhead
   WHERE (flhead_id=pSourceFlheadid);

-- Create temporary table so old and new group ids can be stored
 SELECT relname FROM pg_class INTO _tblName
 WHERE relname = ''tmp_flgrpxref'';
 IF (_tblName IS NULL) THEN
  EXECUTE ''CREATE TEMPORARY TABLE tmp_flgrpxref'' || getEffectiveXtUser() || '' 
  (
	flgrpxref_oldid int4,
	flgrpxref_newid int4
  ) ON COMMIT DROP;'';
  END IF;

-- Copy the top level groups
  PERFORM copyFinancialGroup(flgrp_id, _flheadid, -1)
     FROM flgrp
    WHERE ((flgrp_flhead_id=pSourceFlheadid)
      AND  (flgrp_flgrp_id=-1));

-- Update Group Percent settings
  EXECUTE ''UPDATE flgrp
  SET flgrp_prcnt_flgrp_id=flgrpxref_newid
  FROM tmp_flgrpxref'' || getEffectiveXtUser() || '' 
  WHERE ((flgrp_flhead_id='' || _flheadid || '')
  AND (flgrp_prcnt_flgrp_id=flgrpxref_oldid));'';

  EXECUTE ''UPDATE flitem
  SET flitem_prcnt_flgrp_id=flgrpxref_newid
  FROM tmp_flgrpxref'' || getEffectiveXtUser() || '' 
  WHERE ((flitem_flhead_id='' || _flheadid || '')
  AND (flitem_prcnt_flgrp_id=flgrpxref_oldid));'';

  EXECUTE ''UPDATE flspec
  SET flspec_prcnt_flgrp_id=flgrpxref_newid
  FROM tmp_flgrpxref'' || getEffectiveXtUser() || '' 
  WHERE ((flspec_flhead_id='' || _flheadid || '')
  AND (flspec_prcnt_flgrp_id=flgrpxref_oldid));'';

-- Copy Column Layounts
  INSERT INTO flcol
        (flcol_flhead_id,
        flcol_name,
        flcol_descrip,
        flcol_report_id,
        flcol_month,
        flcol_quarter,
        flcol_year,
        flcol_showdb,
        flcol_prcnt,
        flcol_priortype,
        flcol_priormonth,
        flcol_priorquarter,
        flcol_prioryear,
        flcol_priorprcnt,
        flcol_priordiff,
        flcol_priordiffprcnt,
        flcol_budget,
        flcol_budgetprcnt,
        flcol_budgetdiff,
        flcol_budgetdiffprcnt
)
SELECT
        _flheadid,flcol_name,flcol_descrip,
        flcol_report_id,flcol_month,flcol_quarter,
        flcol_year,flcol_showdb,flcol_prcnt,
        flcol_priortype,flcol_priormonth,flcol_priorquarter,
        flcol_prioryear,flcol_priorprcnt,flcol_priordiff,
        flcol_priordiffprcnt,flcol_budget,flcol_budgetprcnt,
        flcol_budgetdiff,flcol_budgetdiffprcnt
FROM flcol
WHERE (flcol_flhead_id=pSourceFlheadid);

  RETURN _flheadid;
END;
' LANGUAGE 'plpgsql';
