<?php
require 'connection.php';

$postString = $_POST['data'];
if (isset($postString) === false || $postString === null) {
	die('No data found.');
}
parse_str($postString, $dataArray);

$fuelsortId = $_POST['fuelsortId'];
$fuelsortProperty = $_POST['fuelsortProperty'];

foreach ($dataArray as $entry => $entryData) {
	$locationId = findLocationIdByMtskId($entryData['mtsk_id']);
	if ($locationId === null) {
		continue;
	}

	$datetime = $entryData['datum'];
	$price = parsePrice($entryData[$fuelsortProperty]);

	if (wasAlreadyAdded($locationId, $fuelsortId, $price, $datetime) === true) {
		continue;
	}

	$sql = ""
		. "INSERT INTO `" . ENTRY_TABLE . "` "
		. "(`locationId`, `fuelsortId`, `price`, `datetime`, `confirmed`, `deleted`, `mts`) "
		. "VALUES "
		. "(" . $locationId . ", " . $fuelsortId . ", " . $price . ", '" . $datetime . "', 0, 0, 1)"
	;
	mysql_query($sql);
}



function wasAlreadyAdded($locationId, $fuelsortId, $price, $datetime) {
	$sql = ""
		. "SELECT `id` "
		. "FROM `" . ENTRY_TABLE . "` "
		. "WHERE `locationId` = " . $locationId . " AND `fuelsortId` = " . $fuelsortId . " AND `price` = " . $price . " AND `datetime` = '" . $datetime . "' AND `mts` = 1 "
	;
	$result = mysql_query($sql);
	if ($result !== false) {
		if (mysql_fetch_assoc($result) !== false) {
			return true;
		}

		return false;
	}

	return false;
}

function parsePrice($priceString) {
	// price has the format x.yz9. We don't need the last number.
	$priceString = substr($priceString, 0, -1);
	return (float) $priceString;
}

function findLocationIdByMtskId($mtsk_id) {
	$sql = ""
		. "SELECT `id` "
		. "FROM `" . LOCATION_TABLE . "` "
		. "WHERE `mtsk_id` = '" . $mtsk_id . "' "
	;

	$result = mysql_query($sql);
	if ($result !== false) {
		$row = mysql_fetch_assoc($result);

		if ($row === false) {
			return null;
		}

		return (int) $row['id'];
	}

	return null;
}