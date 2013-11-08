<?php
require_once 'connection.php';

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
		. "AND `deleted` = 0 ";

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

function getLocationById($locationId) {
	$sql = ""
		. "SELECT `street`, `city`, `name` FROM `" . LOCATION_TABLE . "`, `" . GASSTATION_TABLE . "` "
		. "WHERE `" . LOCATION_TABLE . "`.`id` = " . (int) $locationId . " "
		. "AND  `" . LOCATION_TABLE . "`.`gasstationId` =  `" . GASSTATION_TABLE . "`.`id` "
	;

	$result = mysql_query($sql);
	if ($result !== false) {
		return mysql_fetch_assoc($result);
	} else {
		return null;
	}
}

function sendMail($subject, $mailBody) {
	$mailHeader = 'MIME-Version: 1.0' . "\r\n";
	$mailHeader .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$mailHeader .= 'From: Philippe <philippe@pschild.de>' . "\r\n";

	mail('philippe.schild@googlemail.com', $subject, $mailBody, $mailHeader);
}