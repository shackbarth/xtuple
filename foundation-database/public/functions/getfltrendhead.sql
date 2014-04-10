CREATE OR REPLACE FUNCTION getfltrendhead(INTEGER, _int4, bpChar)
  RETURNS SETOF fltrendhead AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFlheadid ALIAS FOR $1;
  pPeriodids ALIAS FOR $2;
  pInterval ALIAS FOR $3;
  _row fltrendhead%ROWTYPE;
  _p RECORD;
  _count INTEGER;
  _i INTEGER;
  _t TEXT;
  _fld TEXT[];
  _type CHAR;

BEGIN

-- Validate Interval
   IF pInterval <> ''M'' AND pInterval <> ''Q'' AND pInterval <> ''Y'' THEN
     RAISE EXCEPTION ''Invalid Interval --> %'', pInterval;
   END IF;

   IF ARRAY_UPPER(pPeriodIds,1) <= 12 THEN
        _count := ARRAY_UPPER(pPeriodIds,1);
   ELSE
        _count := 12;
   END IF;

   SELECT flhead_type INTO _type FROM flhead WHERE flhead_id = pFlheadId;

--get data...
--...for Month
        IF (pInterval = ''M'') THEN
                FOR _i IN 1.._count
                LOOP
                        SELECT
                        (CASE
                                WHEN period_name='''' THEN
                                        formatdate(period_start) || ''-'' || formatdate(period_end)
                                ELSE period_name
                        END) INTO _t
                        FROM period
                        WHERE (period_id=pPeriodIds[_i]);

                        _fld[_i] := _t;

                END LOOP;

--...for Quarter
                ELSE IF (pInterval = ''Q'') THEN
                        FOR _i IN 1.._count
                        LOOP
                                SELECT
                                        (''Q'' || period_quarter || ''-'' || EXTRACT(year from yearperiod_end)) INTO _t
                                FROM period, yearperiod
                                WHERE ((period_id=pPeriodIds[_i])
                                AND (period_yearperiod_id=yearperiod_id));

                                        _fld[_i] := _t;

                        END LOOP;
--...for Year
                ELSE
                        FOR _i IN 1.._count
                        LOOP
                                SELECT (EXTRACT(year from yearperiod_end)||'''') INTO _t
                                FROM period, yearperiod
                                WHERE ((period_id=pPeriodIds[_i])
                                AND (period_yearperiod_id=yearperiod_id));

                                _fld[_i] := _t;

                        END LOOP;
                END IF;
        END IF;


-- RETURN RESULTS

        SELECT
                flhead_id AS fltrendhead_flhead_id,
                getEffectiveXtUser() AS fltrendhead_username,
                CASE
                        WHEN flhead_type = ''I'' THEN ''Income Statement''
                        WHEN flhead_type = ''B'' THEN ''Balance Sheet''
                        WHEN flhead_type = ''C'' THEN ''Cash Flow Statement''
                        ELSE ''Ad Hoc''
                END AS fltrendhead_flhead_typedescrip,
                flhead_name AS fltrendhead_flhead_name INTO _p
        FROM flhead
        WHERE (flhead_id=pFlheadId);

                _row.fltrendhead_flhead_id := _p.fltrendhead_flhead_id;
                _row.fltrendhead_username := _p.fltrendhead_username;
               _row.fltrendhead_typedescrip := _p.fltrendhead_flhead_typedescrip;
                _row.fltrendhead_flhead_name := _p.fltrendhead_flhead_name;
                _row.fltrendhead_fld1 := _fld[1];
                _row.fltrendhead_fld2 := _fld[2];
                _row.fltrendhead_fld3 := _fld[3];
                _row.fltrendhead_fld4 := _fld[4];
                _row.fltrendhead_fld5 := _fld[5];
                _row.fltrendhead_fld6 := _fld[6];
                _row.fltrendhead_fld7 := _fld[7];
                _row.fltrendhead_fld8 := _fld[8];
                _row.fltrendhead_fld9 := _fld[9];
                _row.fltrendhead_fld10 := _fld[10];
                _row.fltrendhead_fld11 := _fld[11];
                _row.fltrendhead_fld12 := _fld[12];
                IF (_type IN (''I'',''C'')) THEN
                        _row.fltrendhead_grndttl := ''Total'';
                END IF;

        RETURN NEXT _row;

END;
' LANGUAGE 'plpgsql';
