<?php
require 'connection.php';

require 'Slim-2.2.0/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/entry', function() use ($app) {
	$request = $app->request();
	$id = $request->get('id');
	$page = (int) $request->get('page') - 1;
	$entriesPerPage = (int) $request->get('entriesPerPage');

	$sql = ""
		. "SELECT * FROM `" . ENTRY_TABLE . "` "
		. "WHERE `deleted` <> 1 "
	;

	if($id !== null && $id !== '') {
		$sql .= "AND `id` = " . (int) $id;
	}

	$sql .= "ORDER BY `datetime` DESC, `id` DESC ";

	$start = $page * $entriesPerPage;
	$sql .= "LIMIT " . $start . ", " . $entriesPerPage;

	$result = mysql_query($sql);

	$rows = array();
	while ($row = mysql_fetch_array($result)) {
		$rows[] = array(
			'id' => (int) $row['id'],
			'locationId' => (int) $row['locationId'],
			'fuelsortId' => (int) $row['fuelsortId'],
			'price' => (float) $row['price'],
			'timestamp' => (int) $row['timestamp'],
			'datetime' => $row['datetime'],
			'confirmed' => (int) $row['confirmed'],
			'deleted' => (int) $row['deleted'],
			'mts' => (int) $row['mts']
		);
	}

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode($rows);
});

$app->post('/entry', function() use ($app) {
	$entryData = (array) json_decode($app->request()->getBody(), true);

	$newEntries = array();
	foreach ($entryData as $entry) {
		$locationId = (int) $entry['locationId'];
		$fuelsortId = (int) $entry['fuelsortId'];
		$price = (float) $entry['price'];
		$datetime = $entry['datetime'];

		$sql = ""
			. "INSERT INTO `" . ENTRY_TABLE . "` "
			. "(`locationId`, `fuelsortId`, `price`, `datetime`, `confirmed`, `deleted`, `mts`) "
			. "VALUES "
			. "(" . $locationId . ", " . $fuelsortId . ", " . $price . ", '" . $datetime . "', 0, 0, 0)"
		;

		mysql_query($sql);
		$newEntries[] = array(
			'id' => mysql_insert_id(),
			'locationId' => $locationId,
			'fuelsortId' => $fuelsortId,
			'price' => $price,
			'datetime' => $datetime,
			'confirmed' => 0,
			'deleted' => 0,
			'mts' => 0
		);
	}

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode($newEntries);
});

$app->put('/entry/:id', function($id) use ($app) {
	$entryData = (array) json_decode($app->request()->getBody(), true);

	$locationId = (int) $entryData['locationId'];
	$fuelsortId = (int) $entryData['fuelsortId'];
	$price = (float) $entryData['price'];
	$datetime = $entryData['datetime'];
	$confirmed = (int) $entryData['confirmed'];
	$deleted = (int) $entryData['deleted'];

	$sql = ""
		. "UPDATE `" . ENTRY_TABLE . "` "
		. "SET `locationId` = " . $locationId . ", "
		. "`fuelsortId` = " . $fuelsortId . ", "
		. "`price` = " . $price . ", "
		. "`datetime` = '" . $datetime . "', "
		. "`confirmed` = " . $confirmed . ", "
		. "`deleted` = " . $deleted . ", "
		. "`mts` = 0 "
		. "WHERE `id` = " . (int) $id . " "
	;

	mysql_query($sql);

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('id' => (int) $id));
});

$app->delete('/entry/:id', function($id) use ($app) {
	$sql = ""
		. "UPDATE `" . ENTRY_TABLE . "` "
		. "SET `deleted` = 1 "
		. "WHERE `id` = " . (int) $id . " "
	;

	mysql_query($sql);

	$app->response()->header('Content-Type', 'application/json');
	echo json_encode(array('success' => 'true'));
});

$app->run();