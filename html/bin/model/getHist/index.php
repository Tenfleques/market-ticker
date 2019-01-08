<?php
    require_once ("../../functions.php");
    $errors = [];
    $market = [[],[]];
    $code = 401;

    header("Content-Type: application/json; charset=utf-8");
    if(isset($_POST["email"])){
        $params = [];
        foreach($_POST as $key => $field){
            $params[$key] = sanitizeString($field);
        }
        $dateValid = validDates($params["start_date"], $params["end_date"]);
        $emailValid = validEmail($params["email"]);
        $symbolValid = validSymbol($params["company_symbol"]);
        
        if($dateValid == -1
            && $emailValid == -1
            && $symbolValid == -1){
                $market = queryHistory($params["company_symbol"], $params["start_date"], $params["end_date"]);

                $code = 200;
        }
        
        $errors = [
            "date" => ($dateValid == -1)?"ok":FORM_ERRORS[$dateValid],
            "email" => ($emailValid == -1)?"ok":FORM_ERRORS[$emailValid],
            "symbol" => ($symbolValid == -1)?"ok":FORM_ERRORS[$symbolValid],
            "query" => $market[2]
        ];

        echo json_encode(["errors" => $errors,
                        "chart" => array_values($market[1]),
                        "market" => array_values($market[0]),
                        "code"=>$code],
                        JSON_UNESCAPED_UNICODE);
    }else{
        echo json_encode(["errors" => $errors,
                        "chart" => array_values($market[1]),
                        "market" => array_values($market[0]),
                        "code"=>$code],
                        JSON_UNESCAPED_UNICODE);
    }

    function validDates($sd, $ed){
        /**
         * @args $sd = startdate
         * @args $ed = enddate
         * checks if dates are valid, each as an entity and that the range is valid as well
         */
        $sdValid = dateValid($sd) == -1;
        $edValid = dateValid($ed) == -1;

        if($sdValid && $edValid){
            return (strtotime($sd) <= strtotime($ed))? -1 : 6;
        }
        return 4;
    }
    function dateValid($dt){
        /**
         * checks the validity of a date given a date string
         */
        if(!$dt) //error missing value
            return 0;
        
        $regex_date = '/^\d{4}\-\d{1,2}\-\d{1,2}$/';
        preg_match($regex_date, $dt, $matches, PREG_OFFSET_CAPTURE);
        if(!$matches[0])
            return 1;
        
        $dateParts = explode("-",$dt);
        $day     = $dateParts[2];
        $month   = $dateParts[1];
        $year    = $dateParts[0];

        //compare with 1900 and current year
        if( $year < 1900 && $year > date('Y'))
            return 2;
        
        //check the range of month  
        if($month == 0 || $month > 12){
            return 3;
        }
        
        $monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        // Adjustment for leap years
        if($year % 400 == 0 || ($year % 100 != 0 && $year % 4 == 0)){
            $monthLength[1] = 29;
        }

        if($day > 0 && $day <= $monthLength[$month - 1]){
            //check if full date is before today
            $pickedDateTime = strtotime($dt);
            if($pickedDateTime > time()){
                return 5;
            }  
            //valid date 
            return -1;
        }
        return 4; 

    }
    function validEmail($email){
        /**
         * checks if email is valid
         */
        
        if(!$email)
            return 0;

        $regex_email = '/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

        preg_match($regex_email, $email, $matches, PREG_OFFSET_CAPTURE);
        
        if(!$matches[0])
            return 8;
        //valid
        return -1;
    }
    function validSymbol($symbol){
        /**
         * checks if symbole is valid
         */
        if(!$symbol)
            return 0;

        $tags = json_decode(file_get_contents('http://'.$_SERVER ['HTTP_HOST'].'/bin/model/getSymbols/'));

        if(!in_array(strtoupper($symbol),$tags))
            return 9;
        //valid
        return -1;
    }
    function queryHistory($symbol, $start_date, $end_date){
        /**
         * collects the csv from quandl.com api based on provided parameters
         */
        global $code;
        $hist = [];
        $chart = ["Open" => [],
                    "Close" => []];
        $error = "";
        $keys = [];
        $i = 0;
        $csv = [];
        set_error_handler(function ($err_severity, $err_msg, $err_file, $err_line, array $err_context) {
            throw new ErrorException( $err_msg, 0, $err_severity, $err_file, $err_line );
        }, E_WARNING);
        try{
            $url = "https://www.quandl.com/api/v3/datasets/WIKI/".strtoupper($symbol).".csv?order=asc&start_date=".$start_date."&&end_date=".$end_date;
            $error = $url;
            $csv = file($url);
        }catch(Exception $e){
            $error = "not found ".$url;
            $code = 404;
            return [$hist, $chart, $error];
        } 

        foreach($csv as $index => $line){
            $line = str_replace('"',"",$line);
            $row = explode(",",$line); 
            if(!$i){
                $keys = $row;
            }else{
                $record = [];
                for($j = 0; $j < 6; ++ $j){ //collect the first 5 columns from the csv
                    $record[$keys[$j]] = $row[$j]; 
                }
                $hist[] = $record;
                $chart["Open"][] = [$i-1,floatval($record["Open"])];
                $chart["Close"][] = [$i-1,floatval($record["Close"])];
            }
            ++$i;
        }
        return [$hist, $chart, $error];
    }
?>