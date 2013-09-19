<?php
require 'connection.php';

require 'Slim-2.2.0/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/fuelsort', function() use ($app) {
	$request = $app->request();
	$id = $request->get('id');

	$sql = ""
		. "SELECT * FROM `" . FUELSORT_TABLE . "` "
	;

	if ($id !== null && $id !== '') {
		$sql .= "WHERE `id` = " . (int) $id;
	}

	$result = mysql_query($sql);

	$rows = array();
	while ($row = mysql_fetch_array($result)) {
		$rows[] = array(
			'id' => (int) $row['id'],
			'name' => $row['name'],
			'averagePrice' => getAveragePriceByFuelsortId((int) $row['id']),
			'averagePriceSince14Days' => getAveragePriceByFuelsortId((int) $row['id'], 14)
		);
	}

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode($rows);
});

$app->post('/fuelsort', function() use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('type' => 'post'));
});

$app->put('/fuelsort/:id', function($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('type' => 'put'));
});

$app->delete('/fuelsort/:id', function($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('type' => 'delete'));
});

$app->run();

/**
 * Calculates the average price for the given fuelsortId.
 *
 * @param int $fuelsortId
 * [@param int|null $timeLimitInDays]
 * @return string
 */
function getAveragePriceByFuelsortId($fuelsortId, $timeLimitInDays = null) {
	$sql = ""
		. "SELECT AVG(`price`) AS `avgPrice` FROM `" . ENTRY_TABLE . "` "
		. "WHERE `fuelsortId` = " . (int) $fuelsortId . " "
		. "AND `deleted` = 0 "
	;

	if ($timeLimitInDays !== null) {
		$sql .= ""
			  . "AND `datetime` BETWEEN "
			  . "(SELECT ADDDATE(MAX(`datetime`), INTERVAL -" . (int) $timeLimitInDays . " DAY) FROM `" . ENTRY_TABLE . "` WHERE `fuelsortId` = " . (int) $fuelsortId . " AND `deleted` = 0) "
			  . "AND "
			  . "(SELECT MAX(`datetime`) FROM `" . ENTRY_TABLE . "` WHERE `fuelsortId` = " . (int) $fuelsortId . " AND `deleted` = 0) "
		;
	}

	$result = mysql_query($sql);
	if ($result !== false) {
		$row = mysql_fetch_assoc($result);
		return $row['avgPrice'] === null ? '0.00' : round($row['avgPrice'], 2);
	}
}