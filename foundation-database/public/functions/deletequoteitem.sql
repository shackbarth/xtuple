SELECT dropIfExists('FUNCTION', 'deleteQuoteItem(integer)', 'public');

CREATE OR REPLACE FUNCTION deleteQuoteItem(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pQuitemid ALIAS FOR $1;

  _result               INTEGER;

BEGIN

  DELETE FROM charass
  WHERE (charass_target_type='QI')
    AND (charass_target_id=pQuitemid);

  DELETE FROM quitem
  WHERE (quitem_id=pQuitemid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
