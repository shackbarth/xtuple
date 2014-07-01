ALTER TABLE ccbank DROP CONSTRAINT IF EXISTS ccbank_ccbank_ccard_type_check;
ALTER TABLE ccbank ADD  CONSTRAINT           ccbank_ccbank_ccard_type_check
  CHECK (ccbank_ccard_type = ANY (ARRAY['A', 'D', 'M', 'P', 'V', 'O']));
