<?php
/**
 * http://www.spritpreismonitor.de/suche
 * PLZ = 47533
 * Umkreis = 25km
 */
$superUrl = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=e5&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=';
$dieselUrl = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=diesel&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=';
$e10Url = 'http://www.spritpreismonitor.de/suche/?tx_spritpreismonitor_pi1%5BsearchRequest%5D%5BplzOrtGeo%5D=47533&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bumkreis%5D=25&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Bkraftstoffart%5D=e10&tx_spritpreismonitor_pi1%5BsearchRequest%5D%5Btankstellenbetreiber%5D=';

if ((int) $_GET['fuelsortId'] === 1) {
	applyPrices($superUrl, 1, 'e5');
} else if ((int) $_GET['fuelsortId'] === 3) {
	applyPrices($dieselUrl, 3, 'diesel');
} else if ((int) $_GET['fuelsortId'] === 5) {
	applyPrices($e10Url, 5, 'e10');
}

function applyPrices($url, $fuelsortId, $fuelsortProperty) {
	$html = file_get_contents($url);
	//echo $html;
	preg_match_all('/var spmResult = (\[[a-zA-Z0-9{}&["_\-:.\/, \\\]+\])/', $html, $result);
	$decoded_result = json_decode($result[1][0], true);
	/*
		echo '<pre>';
		var_dump($decoded_result);
		echo '</pre>';
		*/
	$curl = curl_init();
	$query = http_build_query($decoded_result, 'entry_');
	$data = array(
		'data' => $query,
		'fuelsortId' => $fuelsortId,
		'fuelsortProperty' => $fuelsortProperty
	);

	curl_setopt($curl, CURLOPT_URL, 'http://klevertanken.pytalhost.de/_rjs/data/php/mts_receiver.php');
	curl_setopt($curl, CURLOPT_TIMEOUT, 40000);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HEADER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: multipart/form-data"));
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

	ob_start();
	return curl_exec($curl);
	ob_end_clean();
	curl_close($curl);
}