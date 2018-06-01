var App = App || {};

App = (function() {
    var inputs = document.querySelectorAll('input');
    var fromAirport = document.querySelector('input[name="from"]');
    var toAirport = document.querySelector('input[name="to"]');
    var form = document.querySelector('form');
    var button = document.querySelector('.submit button');
    var results = document.querySelector('.results');
    var distance = document.getElementById('distance');
    var numReqFields = 2;
    var validAirports = false;
    
    var checkAirport = function(field) {
        // reset classes
        var classes = field.parentNode.querySelector('.exists').classList;
        while (classes.length > 0) {
            classes.remove(classes.item(0));
        }
        classes.add('exists');

        if(!IntentMedia.Airports.airport_exists(field.value.toUpperCase())) {
            classes.add('show');
            validAirports = false;
        } else {
            validAirports = true;
        }
    };
    
    var bindFields = function() {
        /*** regexes ***/
        var charsOnly = /[A-Z]|[a-z]/;
        var validCode = /^([a-z]|[A-Z]){3}$/;


        var applyError = function(elem) {
            elem.classList.add('error');
            button.setAttribute('disabled', 'disabled');
        };

        [].forEach.call(inputs, function(elem) { // querySelectorAll returns NodeList => can't iterate like an array
            elem.addEventListener('keyup', function(e) {
                // reset classes
                elem.classList.remove('valid', 'error');
                toAirport.parentNode.querySelector('.equal').classList.remove('show');

                //if new char !== a letter, highlight as invalid
                if(!charsOnly.test(e.target.value)) {
                    applyError(elem);
                }

                //if the whole field is valid (exactly 3 letters), highlight as valid
                if(validCode.test(elem.value)) {
                    elem.classList.add('valid');
                } else {
                    applyError(elem);
                }
                
                // airports cannot be the same
                if(toAirport.value.toUpperCase() === fromAirport.value.toUpperCase()) {
                    toAirport.parentNode.querySelector('.equal').classList.add('show');
                }

                var validFields = document.querySelectorAll('input.valid');

                if(validFields.length === numReqFields) {
                    button.removeAttribute('disabled');
                }
            });

        });
    };
    
    var bindButton = function() {
        
        button.addEventListener('click', function() {
//            console.log('clicked');
            
//            [].forEach.call(inputs, function(elem) {
//                elem.setAttribute('readonly', 'readonly');
//                elem.style.pointerEvents = 'none';
//            });
//            
//            form.classList.add('calculate');
//            results.classList.add('show');
//            
//            button.classList.add('hide');
            
            // perform calc
            if(IntentMedia) {
                checkAirport(fromAirport);
                checkAirport(toAirport);
                
                if(validAirports) {
                    console.log(IntentMedia.Distances.distance_between_airports(fromAirport.value.toUpperCase(), toAirport.value.toUpperCase()));
                }
                
                // check airport existence
                    
//                if(IntentMedia.Airports.airport_exists(fromValue) && IntentMedia.Airports.airport_exists(toValue)) {
//                    console.log('both exist!');
//                    
//                    return; // do not execute the functions below
//                }
            }
        });  
    };
    
    return {
        init: function() {
            bindFields();
            bindButton();
        }
    }
 
})();

App.init();
