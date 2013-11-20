<?php
/**
 * Rules:
 * - The function's name must be the same as the file's name (without its extension).
 * - Function must return true or false.
 *
 * @return bool
 */
function test1() {
	$sql = ""
		. "INSERT INTO `" . GASSTATION_TABLE . "` "
		. "(`id`, `name`) "
		. "VALUES "
		. "(999, 'test') "
	;
	$result = mysql_query($sql);

	return $result === false ? false : true;
}