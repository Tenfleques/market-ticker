<?php

function sanitizeString($var){
    /**
     * sanitizes a string to make it safer for storage in the database by converting it to utf-8, removing htmlentities, strippping slashes 
     */
    //$var = strip_tags($var);
    $var = mb_convert_encoding($var, 'UTF-8', 'UTF-8');
    $var = htmlentities($var, ENT_QUOTES, 'UTF-8');
    $var = stripslashes($var);
    //$var = mysqli_real_escape_string($mysqli,$var);
    return $var;
}
?>