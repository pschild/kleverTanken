<?php
require 'connection.php';

require 'Slim-2.2.0/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/gasstation', function() use ($app) {
	$request = $app->request();
	$id = $request->get('id');

	$sql = ""
		. "SELECT * FROM `" . GASSTATION_TABLE . "` "
	;

	if($id !== null && $id !== '') {
		$sql .= "AND `id` = " . (int) $id;
	}

	$result = mysql_query($sql);

	$rows = array();
	while ($row = mysql_fetch_array($result)) {
		$rows[] = array(
			'id' => (int) $row['id'],
			'name' => $row['name']
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