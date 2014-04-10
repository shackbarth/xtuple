SELECT dropifexists('VIEW', 'flaccnt');
CREATE OR REPLACE VIEW flaccnt AS 
(
  SELECT flhead_type, flitem.*, 
    accnt_id, accnt_type, accnt_company,accnt_profit, accnt_number, accnt_sub,
    -1 AS prj_id
  FROM  flhead
    JOIN flitem ON (flhead_id=flitem_flhead_id)
    JOIN accnt ON (flitem_accnt_id=accnt_id)
  UNION ALL
  SELECT flhead_type, flitem.*, 
    accnt_id, accnt_type, accnt_company, accnt_profit, accnt_number,accnt_sub,
    -1 AS prj_id
  FROM  flhead
    JOIN flitem ON (flhead_id=flitem_flhead_id),
    accnt	
  WHERE ((flitem_accnt_id=-1)
    AND ((flitem_type='') OR (accnt_type=flitem_type))
    AND ((flitem_company='All') OR (accnt_company=flitem_company))
    AND ((flitem_profit='All') OR (accnt_profit=flitem_profit))
    AND ((flitem_number='All') OR (accnt_number=flitem_number))
    AND ((flitem_sub='All') OR (accnt_sub=flitem_sub))
    AND ((flitem_subaccnttype_code='All') OR (accnt_subaccnttype_code=flitem_subaccnttype_code)))
  ORDER BY accnt_company, accnt_profit,accnt_number,accnt_sub
);

GRANT ALL ON flaccnt TO xtrole;
