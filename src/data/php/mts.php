<?php
require 'connection.php';

/**
 * PLZ = 47533
 * Umkreis = 25km
 */
$superUrl = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40extension%5D=Spritpreismonitor&tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40controller%5D=Search&tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40action%5D=search&tx_spritpreismonitor_pi1%5B__referrer%5D%5Barguments%5D=YToxOntzOjEzOiJzZWFyY2hSZXF1ZXN0IjthOjQ6e3M6OToicGx6T3J0R2VvIjtzOjU6IjQ3NTMzIjtzOjc6InVta3JlaXMiO3M6MjoiMTAiO3M6MTM6ImtyYWZ0c3RvZmZhcnQiO3M6MjoiZTUiO3M6MjA6InRhbmtzdGVsbGVuYmV0cmVpYmVyIjtzOjE6IjAiO31943c898edcc7f0fb97861db41a24165578a20b61d&tx_spritpreismonitor_pi1%5B__trustedProperties%5D=a%3A1%3A%7Bs%3A13%3A%22searchRequest%22%3Ba%3A4%3A%7Bs%3A9%3A%22plzOrtGeo%22%3Bi%3A1%3Bs%3A7%3A%22umkreis%22%3Bi%3A1%3Bs%3A13%3A%22kraftstoffart%22%3Bi%3A1%3Bs%3A20%3A%22tankstellenbetreiber%22%3Bi%3A1%3B%7D%7D70105c454eba16faccbf2bd6908bb12cb155d4ee&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=e5&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=0';
$dieselUrl = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40extension%5D=Spritpreismonitor&tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40controller%5D=Search&tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40action%5D=search&tx_spritpreismonitor_pi1%5B__referrer%5D%5Barguments%5D=YToxOntzOjEzOiJzZWFyY2hSZXF1ZXN0IjthOjQ6e3M6OToicGx6T3J0R2VvIjtzOjU6IjQ3NTMzIjtzOjc6InVta3JlaXMiO3M6MjoiMjUiO3M6MTM6ImtyYWZ0c3RvZmZhcnQiO3M6MjoiZTUiO3M6MjA6InRhbmtzdGVsbGVuYmV0cmVpYmVyIjtzOjE6IjAiO319e0462227acccced4527ec2e9cddc7e8e9e9245c1&tx_spritpreismonitor_pi1%5B__trustedProperties%5D=a%3A1%3A%7Bs%3A13%3A%22searchRequest%22%3Ba%3A4%3A%7Bs%3A9%3A%22plzOrtGeo%22%3Bi%3A1%3Bs%3A7%3A%22umkreis%22%3Bi%3A1%3Bs%3A13%3A%22kraftstoffart%22%3Bi%3A1%3Bs%3A20%3A%22tankstellenbetreiber%22%3Bi%3A1%3B%7D%7D70105c454eba16faccbf2bd6908bb12cb155d4ee&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=diesel&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=0';
$e10Url = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40extension%5D=Spritpreismonitor&tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40controller%5D=Search&tx_spritpreismonitor_pi1%5B__referrer%5D%5B%40action%5D=search&tx_spritpreismonitor_pi1%5B__referrer%5D%5Barguments%5D=YToxOntzOjEzOiJzZWFyY2hSZXF1ZXN0IjthOjQ6e3M6OToicGx6T3J0R2VvIjtzOjU6IjQ3NTMzIjtzOjc6InVta3JlaXMiO3M6MjoiMjUiO3M6MTM6ImtyYWZ0c3RvZmZhcnQiO3M6NjoiZGllc2VsIjtzOjIwOiJ0YW5rc3RlbGxlbmJldHJlaWJlciI7czoxOiIwIjt9fQ%3D%3D8fdc698aa4e55a8c79d18ce5c43599e1f38bac58&tx_spritpreismonitor_pi1%5B__trustedProperties%5D=a%3A1%3A%7Bs%3A13%3A%22searchRequest%22%3Ba%3A4%3A%7Bs%3A9%3A%22plzOrtGeo%22%3Bi%3A1%3Bs%3A7%3A%22umkreis%22%3Bi%3A1%3Bs%3A13%3A%22kraftstoffart%22%3Bi%3A1%3Bs%3A20%3A%22tankstellenbetreiber%22%3Bi%3A1%3B%7D%7D70105c454eba16faccbf2bd6908bb12cb155d4ee&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=e10&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=0';

applyPrices($superUrl, 1, 'e5');
//applyPrices($dieselUrl, 3, 'diesel');
//applyPrices($e10Url, 5, 'e10');

function applyPrices($url, $fuelsortId, $fuelsortProperty) {
	$html = file_get_contents($url);
	//echo $html;
	preg_match_all('/var spmResult = (\[[a-zA-Z0-9{}["_\-:.\/, \\\]+\])/', $html, $result);
	$decoded_result = json_decode($result[1][0], true);
	/*
	echo '<pre>';
	var_dump($decoded_result);
	echo '</pre>';
	*/
	foreach ($decoded_result as $entry) {
		$locationId = findLocationIdByMtskId($entry['mtsk_id']);
		if ($locationId === null) {
			continue;
		}

		$datetime = $entry['datum'];
		$price = parsePrice($entry[$fuelsortProperty]);

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