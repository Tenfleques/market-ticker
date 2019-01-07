'use strict';

function dateActivate(){
    $( ".datepicker" ).datepicker({
        "dateFormat" : "yy-mm-dd"
    });
}
function validateDate(){
    var dateString = $(this).val();
    var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
    if(!regex_date.test(dateString)){
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
    // Check the ranges of month and year
    if(year < 1900 || year > currentDate.getFullYear() || month == 0 || month > 12){
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
        console.log(pickedDate,pickedDate <= currentDate)
        return pickedDate <= currentDate;
    }else{
        return false;
    }
}
function validateEmail(){
    var email = $(this).val();
    var regex_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex_email.test(email);
}

$(function() {

    dateActivate();//activates the date field 
    
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = $('.needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
              $(".")
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);

  });