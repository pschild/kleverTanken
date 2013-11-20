<?php
require_once '../connection.php';

$path = './scripts/';
$handler = opendir($path);
while (($fileName = readdir($handler)) !== false) {

	$output = '';
	$wholeFileName = $path . $fileName;
	$fileNameWithExtension = explode('.', $fileName);
	$fileBaseName = $fileNameWithExtension[0];

	if (is_file($wholeFileName) === false) {
		continue;
	}

	if (fileWasExecuted($fileBaseName) === true) {
		continue;
	}

	include_once $wholeFileName;

	if (function_exists($fileBaseName) === true) {
		$output .= 'Executing closure of file "' . $fileName . '"... ';
		$success = $fileBaseName();
		if ($success === false) {
			echo 'Please check the function "' . $fileBaseName . '" in file "' . $fileName . '". It returned false!';
			continue;
		}
	} else {
		echo 'There\'s no function called "' . $fileBaseName . '" in file "' . $fileName . '"!';
		continue;
	}

	markFileAsExecuted($fileBaseName);
	$output .= 'Done!<br/>';

	echo $output;
}

closedir($handler);

function fileWasExecuted($fileBaseName) {
	$sql = ""
		. "SELECT `id` "
		. "FROM `" . UPDATE_TABLE . "` "
		. "WHERE `name` = '" . $fileBaseName . "' "
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

function markFileAsExecuted($fileBaseName) {
	$sql = ""
		. "INSERT INTO `" . UPDATE_TABLE . "` "
		. "(`name`, `datetime`) "
		. "VALUES "
		. "('" . $fileBaseName . "', '" . date('Y-m-d H:i:s', time()) . "') "
	;
	$result = mysql_query($sql);
}