In this exercise you need to create a form with 4 input fields:
* Company Symbol
* Start Date (YYYY-mm-dd)
* End Date (YYYY-mm-dd)
* Email

When the user submits the form you must do the following:

1) Validate the form both on client and server side and place appropriate messages on both cases.
All fields must be mandatory. Include also validation for:
- formatting and logic of dates
- existence of company symbol
- formatting of email

2) Display on screen the historical quotes for the submitted company in the given date range in
table format (Date, Open, High, Low, Close and Volume values).
Company symbols can be found here:
http://www.nasdaq.com/screening/companies-by-name.aspx
(For download in excel format: http://www.nasdaq.com/screening/companies-byname.aspx?&render=download)
Data should be retrieved by using the API:
https://www.quandl.com/api/v3/datasets/WIKI/{symbol}.csv?order=asc&start_date={Y-md}&end_date={Y-m-d}
Examples
https://www.quandl.com/api/v3/datasets/WIKI/AAPL.csv?order=asc&start_date=2003-01-
01&end_date=2003-03-06
https://www.quandl.com/api/v3/datasets/WIKI/GOOG.csv?order=asc&start_date=2017-01-
01&end_date=2017-03-06

3) Display a chart of the open and close prices in the given date range.

Notes
* The user must enter date using jQuery UI datepicker
http://jqueryui.com/datepicker/
* You can develop the exercise using plain PHP, but PHP framework (Symfony, Laravel etc) is
preferred.

