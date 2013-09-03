<?php
require 'connection.php';

require 'Slim-2.2.0/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/location', function() use ($app) {
	$request = $app->request();
	$id = $request->get('id');

	$sql = ""
		. "SELECT * FROM `kt_locations` "
	;

	if($id !== null && $id !== '') {
		$sql .= "AND `id` = " . (int) $id;
	}

	$result = mysql_query($sql);

	$rows = array();
	while ($row = mysql_fetch_array($result)) {
		$rows[] = array(
			'id' => (int) $row['id'],
			'gasstationId' => (int) $row['gasstationId'],
			'street' => $row['street'],
			'city' => $row['city'],
			'latitude' => (float) $row['latitude'],
			'longitude' => (float) $row['longitude'],
			'entriesCount' => getEntriesCountByLocationId((int) $row['id'])
		);
	}

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode($rows);
});

$app->post('/gasstation', function() use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('type' => 'post'));
});

$app->put('/gasstation/:id', function($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('type' => 'put'));
});

$app->delete('/gasstation/:id', function($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('type' => 'delete'));
});

$app->run();

/**
 * Counts the entries for given locationId.
 *
 * @param int $locationId
 * @return int
 */
function getEntriesCountByLocationId($locationId) {
	$sql = ""
		. "SELECT COUNT(*) AS `entriesCount` FROM `kt_entries` "
		. "WHERE `locationId` = " . (int) $locationId . " "
		. "AND `deleted` = 0 "
	;

	$result = mysql_query($sql);
	if ($result !== false) {
		$row = mysql_fetch_assoc($result);
		return (int) $row['entriesCount'];
	}
}