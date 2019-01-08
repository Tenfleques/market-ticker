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
const FORM_ERRORS = array(
        "missing_value",
        "malformed",
        "year_out_of_range",
        "month_out_of_range",
        "day_out_of_range",
        "back_from_the_future",
        "date_before_start",
        "date_after_end",
        "error_email",
        "unknown_symbol"
);
?>