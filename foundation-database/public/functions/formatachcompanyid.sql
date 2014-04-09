CREATE OR REPLACE FUNCTION formatACHCompanyId() RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN CASE WHEN fetchMetricText('ACHCompanyIdType') = 'D' THEN '3'
              WHEN fetchMetricText('ACHCompanyIdType') = 'E' THEN '1'
              WHEN fetchMetricText('ACHCompanyIdType') = 'O' THEN '9'
         END ||
         CASE WHEN fetchMetricText('ACHCompanyIdType') = 'D' OR
                   fetchMetricText('ACHCompanyIdType') = 'E' THEN
                 REPLACE(fetchMetricText('ACHCompanyId'), '-', '')
              ELSE fetchMetricText('ACHCompanyId')
         END;
END;
$$
LANGUAGE 'plpgsql';
