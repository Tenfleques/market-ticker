<?php
    $symbolsFile = file($_SERVER["DOCUMENT_ROOT"]."/../configs/companylist.csv");
    $symbols = [];
    foreach($symbolsFile as $index => $line){
        $line = str_replace('"',"",$line);
        $symbols[] = explode(",",$line)[0]; //collect the symbol only;
    }
    unset($symbols[0]); //unset the headers
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(array_values($symbols),JSON_UNESCAPED_UNICODE);
?>