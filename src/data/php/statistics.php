<?php
require 'connection.php';

require 'Slim-2.2.0/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/statistic', function() use ($app) {
	$request = $app->request();
	$fuelsortId = (int) $request->get('fuelsortId');
	$locationId = (int) $request->get('locationId'); // -1 = all locations
	$fromDate = $request->get('fromDate');
	$toDate = $request->get('toDate');

	$priceStatsData = getPriceStatsByCriteria($fromDate, $toDate, $fuelsortId, $locationId);
	$priceStatsDataWithoutLocation = getPriceStatsByCriteria($fromDate, $toDate, $fuelsortId);
	$cheapestAndMostExpensiveData = getCheapestAndMostExpensiveDayByCriteria($fromDate, $toDate, $fuelsortId, $locationId);

	$data = array(
		'avgPrice' => round($priceStatsData['avgPrice'], 2),
		'minPrice' => round($priceStatsData['minPrice'], 2),
		'maxPrice' => round($priceStatsData['maxPrice'], 2),

		'cheapestDay' => $cheapestAndMostExpensiveData['cheapestDayName'],
		'cheapestAvgPriceDay' => round($cheapestAndMostExpensiveData['cheapestAvgPrice'], 2),
		'mostExpensiveDay' => $cheapestAndMostExpensiveData['mostExpensiveDayName'],
		'mostExpensiveAvgPriceDay' => round($cheapestAndMostExpensiveData['mostExpensiveAvgPrice'], 2)
	);

	/* if a location was selected */
	if ($locationId > 0) {
		$data['priceDevelopmentData'] = array(
			'values' => getPriceDevelopmentData($fromDate, $toDate, $fuelsortId, $locationId),
			'avgOverall' => round($priceStatsDataWithoutLocation['avgPrice'], 2)
		);
	}

	/* if no location was selected for the statistic */
	if ($locationId < 0) {
		$cheapestAndMostExpensiveLocationData = getCheapestAndMostExpensiveLocationByCriteria($fromDate, $toDate, $fuelsortId);
		$data['locationData'] = array(
			'cheapestLocationId' => $cheapestAndMostExpensiveLocationData['cheapestLocationId'],
			'cheapestAvgPriceLocation' => round($cheapestAndMostExpensiveLocationData['cheapestAvgPrice'], 2),
			'mostExpensiveLocationId' => $cheapestAndMostExpensiveLocationData['mostExpensiveLocationId'],
			'mostExpensiveAvgPriceLocation' => round($cheapestAndMostExpensiveLocationData['mostExpensiveAvgPrice'], 2)
		);
	}

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode($data);
});

$app->run();

function getPriceDevelopmentData($fromDate, $toDate, $fuelsortId, $locationId) {
	$sql = ""
		. "SELECT `datetime`, `price` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `locationId` = " . (int) $locationId . " "
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

function getPriceStatsByCriteria($fromDate, $toDate, $fuelsortId, $locationId = 0) {
	$sql = ""
		. "SELECT AVG(`price`) AS `avgPrice`, MIN(`price`) AS `minPrice`, MAX(`price`) AS `maxPrice` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00' AND '" . $toDate . " 23:59' "
		. "AND `deleted` = 0 "
	;

	if ((int) $locationId > 0) {
		$sql .= "AND `locationId` = " . (int) $locationId . " ";
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

function getCheapestAndMostExpensiveDayByCriteria($fromDate, $toDate, $fuelsortId, $locationId) {
	$sql = ""
		. "SELECT `fuelsortId`, COUNT(`price`) AS `count`, AVG(`price`) AS `avgPrice`, DAYNAME(`datetime`) AS `dayName` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00:01' AND '" . $toDate . " 23:59:59' "
		. "AND `deleted` = 0 "
	;

	if ((int) $locationId > 0) {
		$sql .= "AND `locationId` = " . (int) $locationId . " ";
		$sql .= "GROUP BY `fuelsortId`, `locationId`, `dayName` ";
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

function getCheapestAndMostExpensiveLocationByCriteria($fromDate, $toDate, $fuelsortId) {
	$sql = ""
		. "SELECT `locationId`, COUNT(`price`) AS `count`, AVG(`price`) AS `avgPrice` "
		. "FROM `kt_entries` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `datetime` BETWEEN '" . $fromDate . " 00:00:01' AND '" . $toDate . " 23:59:59' "
		. "AND `deleted` = 0 "
		. "GROUP BY `locationId` "
	;

	$result = mysql_query($sql);
	$data = array();
	while ($row = mysql_fetch_assoc($result)) {
		$data[$row['locationId']] = $row['avgPrice'];
	}

	if (count($data) === 0) {
		return array(
			'cheapestLocationId' => 'n/a',
			'mostExpensiveLocationId' => 'n/a',
			'cheapestAvgPrice' => 'n/a',
			'mostExpensiveAvgPrice' => 'n/a'
		);
	}

	$cheapestLocationId = array_keys($data, min($data));
	$mostExpensiveLocationId = array_keys($data, max($data));
	return array(
		'cheapestLocationId' => (int) $cheapestLocationId[0],
		'mostExpensiveLocationId' => (int) $mostExpensiveLocationId[0],
		'cheapestAvgPrice' => min($data),
		'mostExpensiveAvgPrice' => max($data)
	);
}

function mapEnglishToGerman($string) {
	$lang = array(
		'Monday' => 'Montags',
		'Tuesday' => 'Dienstags',
		'Wednesday' => 'Mittwochs',
		'Thursday' => 'Donnerstags',
		'Friday' => 'Freitags',
		'Saturday' => 'Samstags',
		'Sunday' => 'Sonntags'
	);

	return $lang[$string];
}