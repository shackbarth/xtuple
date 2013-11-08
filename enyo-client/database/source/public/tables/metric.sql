-- Add default welcome page path
insert into metric (metric_name, metric_value)
select 'WelcomePage', 'https://www.xtuple.com/welcome'
where not exists (select c.metric_id from metric c where c.metric_name = 'WelcomePage');

-- Add default valid credit card days
insert into metric (metric_name, metric_value)
select 'CCValidDays', '7'
where not exists (select c.metric_id from metric c where c.metric_name = 'CCValidDays');
