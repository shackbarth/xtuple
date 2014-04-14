SELECT dropIfExists('VIEW', 'salesorder', 'api');
SELECT dropIfExists('FUNCTION', 'freightDetail(text, integer)', 'public');
SELECT dropIfExists('FUNCTION', 'freightDetail(text, integer, integer, integer, date, text, integer)', 'public');
SELECT dropIfExists('FUNCTION', 'freightdetailquote(integer, text, integer, text, date, text, text, text[])',  'public');
SELECT dropIfExists('FUNCTION', 'calculateFreightDetail(integer, integer, text, integer, integer, text, date, text, integer, character varying, integer, integer, numeric)',  'public');
SELECT dropIfExists('TYPE', 'freightData', 'public');

CREATE TYPE freightData AS (
  freightData_schedule      text,
  freightData_from          text,
  freightData_to            text,
  freightData_shipvia       text,
  freightData_freightclass  text,
  freightData_weight        numeric,
  freightData_uom           text,
  freightData_price         numeric,
  freightData_type          text,
  freightData_total         numeric,
  freightData_currency      text
);
