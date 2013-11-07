<?php
require 'connection.php';
require '_functions.php';

/**
 * http://www.spritpreismonitor.de/suche
 * PLZ = 47533
 * Umkreis = 25km
 */
$superUrl = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=e5&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=';
$dieselUrl = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=diesel&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=';
$e10Url = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=e10&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=';

if ((int) $_GET['fuelsortId'] === 1) {
	$data = extractData($superUrl, 'e5');
	applyData(1, $data);
} else if ((int) $_GET['fuelsortId'] === 3) {
	$data = extractData($dieselUrl, 'diesel');
	applyData(3, $data);
} else if ((int) $_GET['fuelsortId'] === 5) {
	$data = extractData($e10Url, 'e10');
	applyData(5, $data);
}

function extractData($url, $fuelsortProperty) {
	$html = file_get_contents($url);
	//echo $html;
	preg_match_all('/var spmResult = (\[[a-zA-Z0-9{}&["_\-:.\/, \\\]+\])/', $html, $result);
	$decoded_result = json_decode($result[1][0], true);

	$data = array();
	foreach ($decoded_result as $externalData) {
		$data[] = array(
			'mtsk_id' => $externalData['mtsk_id'],
			'price' => $externalData[$fuelsortProperty],
			'datetime' => $externalData['datum']
		);
	}
	/*
	echo '<pre>';
	var_dump($data);
	echo '</pre>';
	*/
	return $data;
}

function applyData($fuelsortId, $data) {
	$count = 0;
	$mailBody = '';
	foreach ($data as $entryData) {
		$locationId = findLocationIdByMtskId($entryData['mtsk_id']);
		if ($locationId === null) {
			continue;
		}

		$datetime = $entryData['datetime'];
		$price = parsePrice($entryData['price']);

		if (wasAlreadyAdded($locationId, $fuelsortId, $price, $datetime) === true) {
			continue;
		}

		if ($fuelsortId === 1 && $price <= 1.48) {
			$location = getLocationById($locationId);

			$mailBody .= '<b>' . $price . '</b>, ' . $datetime . '<br/>' . $location['name'] . ', ' . $location['street'] . ', ' . $location['city'] . '<br/><br/>';
		}

		$sql = ""
			. "INSERT INTO `" . ENTRY_TABLE . "` "
			. "(`locationId`, `fuelsortId`, `price`, `datetime`, `confirmed`, `deleted`, `mts`) "
			. "VALUES "
			. "(" . $locationId . ", " . $fuelsortId . ", " . $price . ", '" . $datetime . "', 0, 0, 1)"
		;
		mysql_query($sql);

		$count++;
	}

	echo $count . ' Eintraege hinzugefuegt.';

	if ($fuelsortId === 1 && $mailBody !== '') {
		sendMail(
			'Jetzt Super tanken!',
			$mailBody
		);
	}
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
		. "WHERE `mtsk_id` = '" . $mtsk_id . "' ";

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