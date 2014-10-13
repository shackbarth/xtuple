-- 4.4.1 and 4.5.0 fix - synchronize flcol_report_id
do $$
begin
if fetchMetricText('ServerVersion') < '4.6.0' then

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReport'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id=285
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonth'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (375, 335)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthBudget'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (376, 336)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthDbCr'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id=387
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthPriorMonth'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (377, 337)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthPriorQuarter'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (386, 346)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthPriorYear'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (378, 338)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthQuarter'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (379, 339)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportMonthYear'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (374, 334)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportQuarter'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (380, 340)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportQuarterBudget'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (381, 341)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportQuarterPriorQuarter'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (382, 342)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportYear'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (383, 343)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportYearBudget'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (384, 344)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialReportYearPriorYear'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id in (385, 345)
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

update flcol set flcol_report_id = (select report_id from report
                                    where report_name = 'FinancialTrend'
                                    order by report_grade desc
                                    limit 1)
where flcol_report_id=388
and flcol_id in (
  select flcol_id
  from flcol left join report on flcol_report_id = report_id
  where report_id is null)
;

end if;
end$$;