<?php
require 'connection.php';

require 'Slim-2.2.0/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/statistic', function() use ($app) {
	$request = $app->request();
	$fuelsortId = (int) $request->get('fuelsortId');
	$gasstationId = (int) $request->get('gasstationId'); // -1 = all gasstations
	$fromDate = $request->get('fromDate');
	$toDate = $request->get('toDate');

	$priceStatsData = getPriceStatsByCriteria($fromDate, $toDate, $fuelsortId, $gasstationId);
	$priceStatsDataWithoutGasstation = getPriceStatsByCriteria($fromDate, $toDate, $fuelsortId);
	$cheapestAndMostExpensiveData = getCheapestAndMostExpensiveDayByCriteria($fromDate, $toDate, $fuelsortId, $gasstationId);

	$data = array(
		'avgPrice' => round($priceStatsData['avgPrice'], 2),
		'minPrice' => round($priceStatsData['minPrice'], 2),
		'maxPrice' => round($priceStatsData['maxPrice'], 2),

		'cheapestDay' => $cheapestAndMostExpensiveData['cheapestDayName'],
		'cheapestAvgPriceDay' => round($cheapestAndMostExpensiveData['cheapestAvgPrice'], 2),
		'mostExpensiveDay' => $cheapestAndMostExpensiveData['mostExpensiveDayName'],
		'mostExpensiveAvgPriceDay' => round($cheapestAndMostExpensiveData['mostExpensiveAvgPrice'], 2)
	);

	/* if a gasstation was selected */
	if ($gasstationId > 0) {
		$data['priceDevelopmentData'] = array(
			'values' => getPriceDevelopmentData($fromDate, $toDate, $fuelsortId, $gasstationId),
			'avgOverall' => round($priceStatsDataWithoutGasstation['avgPrice'], 2)
		);
	}

	/* if no gasstation was selected for the statistic */
	if ($gasstationId < 0) {
		$cheapestAndMostExpensiveGasstationData = getCheapestAndMostExpensiveGasstationByCriteria($fromDate, $toDate, $fuelsortId);
		$data['cheapestGasstationId'] = $cheapestAndMostExpensiveGasstationData['cheapestGasstationId'];
		$data['cheapestAvgPriceGasstation'] = round($cheapestAndMostExpensiveGasstationData['cheapestAvgPrice'], 2);
		$data['mostExpensiveGasstationId'] = $cheapestAndMostExpensiveGasstationData['mostExpensiveGasstationId'];
		$data['mostExpensiveAvgPriceGasstation'] = round($cheapestAndMostExpensiveGasstationData['mostExpensiveAvgPrice'], 2);

	}

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode($data);
});

$app->run();

function getPriceDevelopmentData($fromDate, $toDate, $fuelsortId, $gasstationId) {
	$sql = ""
		. "SELECT `datetime`, `price` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `gasstationId` = " . (int) $gasstationId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00' AND '" . $toDate . " 23:59' "
		. "AND `deleted` = 0 "
		. "ORDER BY `datetime` ASC "
	;

	$result = mysql_query($sql);
	$data = array();
	while ($row = mysql_fetch_assoc($result)) {
		$data[] = $row;
	}

	return $data;
}

function getPriceStatsByCriteria($fromDate, $toDate, $fuelsortId, $gasstationId = 0) {
	$sql = ""
		. "SELECT AVG(`price`) AS `avgPrice`, MIN(`price`) AS `minPrice`, MAX(`price`) AS `maxPrice` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00' AND '" . $toDate . " 23:59' "
		. "AND `deleted` = 0 "
	;

	if ((int) $gasstationId > 0) {
		$sql .= "AND `gasstationId` = " . (int) $gasstationId . " ";
	}

	$result = mysql_query($sql);
	if ($result !== false) {
		$row = mysql_fetch_assoc($result);
		return array(
			'avgPrice' => (float) $row['avgPrice'],
			'minPrice' => (float) $row['minPrice'],
			'maxPrice' => (float) $row['maxPrice']
		);
	}

	return false;
}

function getCheapestAndMostExpensiveDayByCriteria($fromDate, $toDate, $fuelsortId, $gasstationId) {
	$sql = ""
		. "SELECT `fuelsortId`, COUNT(`price`) AS `count`, AVG(`price`) AS `avgPrice`, DAYNAME(`datetime`) AS `dayName` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00:01' AND '" . $toDate . " 23:59:59' "
		. "AND `deleted` = 0 "
	;

	if ((int) $gasstationId > 0) {
		$sql .= "AND `gasstationId` = " . (int) $gasstationId . " ";
		$sql .= "GROUP BY `fuelsortId`, `gasstationId`, `dayName` ";
	} else {
		$sql .= "GROUP BY `fuelsortId`, `dayName` ";
	}

	$result = mysql_query($sql);
	$data = array();
	while ($row = mysql_fetch_assoc($result)) {
		$data[$row['dayName']] = $row['avgPrice'];
	}

	if (count($data) === 0) {
		return array(
			'cheapestDayName' => 'n/a',
			'mostExpensiveDayName' => 'n/a',
			'cheapestAvgPrice' => 'n/a',
			'mostExpensiveAvgPrice' => 'n/a'
		);
	}

	$cheapestDayName = array_keys($data, min($data));
	$mostExpensiveDayName = array_keys($data, max($data));
	return array(
		'cheapestDayName' => mapEnglishToGerman($cheapestDayName[0]),
		'mostExpensiveDayName' => mapEnglishToGerman($mostExpensiveDayName[0]),
		'cheapestAvgPrice' => min($data),
		'mostExpensiveAvgPrice' => max($data)
	);
}

function getCheapestAndMostExpensiveGasstationByCriteria($fromDate, $toDate, $fuelsortId) {
	$sql = ""
		. "SELECT `gasstationId`, COUNT(`price`) AS `count`, AVG(`price`) AS `avgPrice` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00:01' AND '" . $toDate . " 23:59:59' "
		. "AND `deleted` = 0 "
		. "GROUP BY `gasstationId` "
	;

	$result = mysql_query($sql);
	$data = array();
	while ($row = mysql_fetch_assoc($result)) {
		$data[$row['gasstationId']] = $row['avgPrice'];
	}

	if (count($data) === 0) {
		return array(
			'cheapestGasstationId' => 'n/a',
			'mostExpensiveGasstationId' => 'n/a',
			'cheapestAvgPrice' => 'n/a',
			'mostExpensiveAvgPrice' => 'n/a'
		);
	}

	$cheapestGasstationId = array_keys($data, min($data));
	$mostExpensiveGasstationId = array_keys($data, max($data));
	return array(
		'cheapestGasstationId' => (int) $cheapestGasstationId[0],
		'mostExpensiveGasstationId' => (int) $mostExpensiveGasstationId[0],
		'cheapestAvgPrice' => min($data),
		'mostExpensiveAvgPrice' => max($data)
	);
}

function mapEnglishToGerman($string) {
	$lang = array(
		'Monday' => 'Montag',
		'Tuesday' => 'Dienstag',
		'Wednesday' => 'Mittwoch',
		'Thursday' => 'Donnerstag',
		'Friday' => 'Freitag',
		'Saturday' => 'Samstag',
		'Sunday' => 'Sonntag'
	);

	return $lang[$string];
}