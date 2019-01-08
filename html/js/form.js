'use strict';
$(function() {
    var FORM_ERRORS = {
        "en" : {
            "missing_value": "This field is required!",
            "malformed" : "The date should be formatted as YYYY-mm-dd",
            "year_out_of_range": "The year should be between 1900 "+ new Date().getFullYear(),
            "month_out_of_range": "The month should be between 01 - 12",
            "day_out_of_range": "Such a date doesn't exist for the selected year and month",
            "back_from_the_future": "Date's in the future. Are you a time traveller?",
            "date_before_start" : "Pick a date that is later than start date",
            "date_after_end" : "Pick a date that's before the end date ",
            "error_email" : "Input a valid email address",
            "unknown_symbol": "The symbol supplied cannot be found!",
            "ok": ""
        },
        "ru" : {
            "missing_value": "Это поле обязательно к заполнению!",
            "malformed" : "Дата должна быть отформатирована как ГГГГ-мм-дд",
            "year_out_of_range": "Год должен быть между1900 "+ new Date().getFullYear(),
            "month_out_of_range": "Месяц должен быть между 01 - 12",
            "day_out_of_range": "Такой даты не существует для выбранного года и месяца",
            "back_from_the_future": "Дата в будущем. Вы путешественник во времени?",
            "date_before_start" : "Выберите дату, которая позже даты начала",
            "date_after_end" : "Выберите дату, предшествующую дате окончания ",
            "error_email" : "Введите действительный адрес электронной почты",
            "unknown_symbol": "Поставленный символ не может быть найден!",
            "ok":""
        }
    }
    function fieldShowError(){
        /**
         * @args field selector 
         * @optional error index
         * shows the error associated with an invalid field on submit
         */
        var lang = getCookie("lang");
        var err = (arguments[0])?FORM_ERRORS[lang][arguments[0]]:"";
        
        (err && $(this).addClass("border-danger"))  
            || $(this).removeClass("border-danger");

        $(this).parent().find("small").html(err);

        return err.length !=0;
    }

    function dateActivate(){
        /**
         * activates the datepicker using jquery-ui
         */
        $( ".datepicker" ).datepicker({
            "dateFormat" : "yy-mm-dd",
            "yearRange": "1900:"+new Date().getFullYear(),
            "onSelect" : function(){
                $(this).removeClass("border-danger");
            }
        });
    }

    function dateValid(){
        /**
         * @args date field selector
         * checks the validity of a date given a field selector
         */
        var dateString = $(this).val();
        var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

        if(isEmpty.apply(this)){//empty field
            return false;
        }

        if(!regex_date.test(dateString)){ //unsupported formart
            fieldShowError.apply($(this),["malformed"]);
            return false;
        }
        // Parse the date parts to integers
        var dateParts = dateString
                            .split("-")
                            .map(function(val){ return parseInt(val,10); });

        var day     = dateParts[2];
        var month   = dateParts[1];
        var year    = dateParts[0];

        var currentDate = new Date();
        // Check the range of year
        if(year < 1900 || year > currentDate.getFullYear()){
            fieldShowError.apply($(this),["year_out_of_range"]);
            return false;
        }
        //check the range of month  
        if(month == 0 || month > 12){
            fieldShowError.apply($(this),["month_out_of_range"]);
            return false;
        }
        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        // Adjustment for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){
            monthLength[1] = 29;
        }

        if(day > 0 && day <= monthLength[month - 1]){
            //check if full date is before today
            var pickedDate = new Date(dateString);
            if(pickedDate > currentDate){
                fieldShowError.apply($(this),["back_from_the_future"]);
                return false;
            }  
            //valid date      
            fieldShowError.apply($(this),[]);
            return true;
        }
        fieldShowError.apply($(this),["day_out_of_range"])
        return false;    
    }
    function validDates(){
        /**
         * validates the two date fields
         */
        var startDate = $("#start_date");
        var endDate = $("#end_date");

        var sValid = dateValid.apply(startDate); //check the validity of start date
        var eValid = dateValid.apply(endDate); //check validity of end date
        if( sValid && 
            eValid){//do further tests, to check if start date is less than end date
            if(new Date(startDate.val()) <= new Date(endDate.val())){ //dates pass all the tests
                fieldShowError.apply(startDate,[]);
                fieldShowError.apply(endDate,[]);
                return true;
            }
            //fail on the date range 
            fieldShowError.apply(startDate,["date_after_end"]);
            fieldShowError.apply(endDate,["date_before_start"]);   
        }
        return false;    
    }
    function validEmail(){
        /**
         * @args email field selector
         * checks for the validity of email address
         */
        var email = $(this);

        if(isEmpty.apply(email))
            return false;

        var regex_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        var valid = regex_email.test(email.val());
        
        (!valid
            && fieldShowError.apply(email,["error_email"])) //not valid, activate error
            || fieldShowError.apply(email); //valid email

        return valid;
    }
    function isEmpty(){
        /**
         * @args field selector
         * checks if field has empty value
         */
        var field = $(this);
        if(field.val().length == 0){//empty field
            fieldShowError.apply(field,["missing_value"]);
            return true;
        }
        fieldShowError.apply(field); //field has value
        return false;
    }

    function validSymbol(){
        /**
         * @args symbol field selector
         * checks for the validity of symbol
         */
        var symbol = $(this);
        if(isEmpty.apply(symbol)) //check if empty
            return false;

        var tags = symbol.data("tags") || []; //if tags failed to load, use empty list
        var valid = tags.includes(symbol.val().toUpperCase());
        (!valid && fieldShowError.apply(symbol,["unknown_symbol"])) //symbol not found in list
        || fieldShowError.apply(symbol); //symbol found in list
        return valid;
    }
    function symbolsAssist(){
        /**
         * loads from server, list of symbols and activate autocomplete from jquery-ui
         */
        var getSymbols = $.get("/bin/model/getSymbols/");
        getSymbols.done(function(tags){
            $( ".autocomplete" ).autocomplete({
                source: function( request, response ) {
                    var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
                    response( $.grep( tags, function( item ){
                        return matcher.test( item );
                    }) );
                }
            }).data("tags",tags); //embed the tags to the element for use in validation later
        });       
    }
    function formCtrl(e){
        /**
         * @args submit event
         * handles the submission of the form
         */
        e.preventDefault();
        //do validation
        var validFields = [
            validDates(), 
            validEmail.apply($("#email")),
            validSymbol.apply($("#company_symbol"))];

        var payload = {
            "email" : $("#email").val(),
            "company_symbol": $("#company_symbol").val(),
            "start_date": $("#start_date").val(),
            "end_date" : $("#end_date").val()
        };
        if(validFields.reduce((a,b)=> a && b,true)){ //load data when all tests are satisfied
            loadData(payload);
        };
    }

    function main(){
        /**
         * script entrypoint
         */
        dateActivate();//activates the date field 
        symbolsAssist(); //activates the symbols field
        initTable();//initialize the table
        loadChart();//init chart

        $(".form-control").on("input",function() { //clears errors on input on any field
            $(this).removeClass("border-danger");
            fieldShowError.apply(email,[""]);
        });
        var forms = $('.needs-validation');
        forms.on("submit", formCtrl);
    }

    main();
  });