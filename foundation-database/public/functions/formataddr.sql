
CREATE OR REPLACE FUNCTION formatAddr(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAddrId       ALIAS FOR $1;
  _return       TEXT;

BEGIN
  -- US conventions
  SELECT formatAddr(addr_line1, addr_line2, addr_line3,
                    addr_city || ', ' || addr_state || ' ' || addr_postalcode,
                    addr_country) INTO _return
  FROM addr
  WHERE (addr_id=pAddrId);

  RETURN _return;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION formatAddr(TEXT, TEXT, TEXT, TEXT, INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  f_addr1 ALIAS FOR $1;
  f_addr2 ALIAS FOR $2;
  f_addr3 ALIAS FOR $3;
  csz     ALIAS FOR $4;
  line    ALIAS FOR $5;

BEGIN
  RETURN formatAddr(f_addr1, f_addr2, f_addr3, csz, '', line);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION formatAddr(TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER) RETURNS TEXT AS $$ 
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  f_addr1 ALIAS FOR $1;
  f_addr2 ALIAS FOR $2;
  f_addr3 ALIAS FOR $3;
  csz     ALIAS FOR $4;
  country ALIAS FOR $5;
  line    ALIAS FOR $6;

  i int:=0;

BEGIN

  IF (LENGTH(TRIM(both from f_addr1)) > 0) THEN
    i:=i+1;
  END IF;

  IF (i=line) THEN
    RETURN f_addr1;
  END IF;

  IF (LENGTH(TRIM(both from f_addr2)) > 0)  THEN
    i:=i+1;
  END IF;

  IF (i=line) THEN
    RETURN f_addr2;
  END IF;

  IF (LENGTH(TRIM(both from f_addr3)) > 0) THEN
    i:=i+1;
  END IF;

  IF (i=line) THEN
    RETURN f_addr3;
  END IF;

  IF (LENGTH(TRIM(both from csz)) > 0) THEN
    i:=i+1;
  END IF;

  IF (i=line) THEN
    RETURN csz;
  END IF;

  IF (LENGTH(TRIM(both from country)) > 0) THEN
    i:=i+1;
  END IF;

  IF (i=line) THEN
    RETURN country;
  END IF;

  RETURN ' ';

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION formatAddr(TEXT, TEXT, TEXT, TEXT, TEXT) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  f_addr1 ALIAS FOR $1;
  f_addr2 ALIAS FOR $2;
  f_addr3 ALIAS FOR $3;
  csz     ALIAS FOR $4;
  country ALIAS FOR $5;
  addr TEXT:='';

BEGIN

  IF (LENGTH(TRIM(both from f_addr1)) > 0) THEN
    addr:=f_addr1;
  END IF;

  IF (LENGTH(TRIM(both from f_addr2)) > 0)  THEN
        IF (LENGTH(TRIM(both from addr)) > 0) THEN
                addr:=addr || E'\n';
        END IF;
    addr:=addr || f_addr2;
  END IF;

  IF (LENGTH(TRIM(both from f_addr3)) > 0)  THEN
        IF (LENGTH(TRIM(both from addr)) > 0) THEN
                addr:=addr || E'\n';
        END IF;
    addr:=addr || f_addr3;
  END IF;

  IF (LENGTH(TRIM(both from csz)) > 0)  THEN
        IF (LENGTH(TRIM(both from addr)) > 0) THEN
                addr:=addr || E'\n';
        END IF;
    addr:=addr || csz;
  END IF;

  IF (LENGTH(TRIM(both from country)) > 0)  THEN
        IF (LENGTH(TRIM(both from addr)) > 0) THEN
                addr:=addr || E'\n';
        END IF;
    addr:=addr || country;
  END IF;

  RETURN addr;

END;
$$ LANGUAGE 'plpgsql';

