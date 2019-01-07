<?php
    $settingsReadFile = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/../configs/application.json");
    $appDetails = json_decode($settingsReadFile,true);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($appDetails,JSON_UNESCAPED_UNICODE);
?>