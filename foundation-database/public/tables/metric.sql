-- Proof of concept
insert into metric (metric_name, metric_value)
select 'UnifiedBuild', 'true'
where not exists (select c.metric_id from metric c where c.metric_name = 'UnifiedBuild');

SELECT setMetric('ServerVersion', '4.4.1');
