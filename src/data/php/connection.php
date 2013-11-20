<?php
$connection = mysql_connect('127.0.0.1', 'root', '');
mysql_select_db('tankstellenapp', $connection);

mysql_set_charset('UTF8');

define('ENTRY_TABLE', 'kt_entries');
define('FUELSORT_TABLE', 'kt_fuelsorts');
define('GASSTATION_TABLE', 'kt_gasstations');
define('LOCATION_TABLE', 'kt_locations');
define('UPDATE_TABLE', 'kt_updates');