var App = App || {};

App = (function() {
    var inputs = document.querySelectorAll('input');
    var fromAirport = document.querySelector('input[name="from"]');
    var toAirport = document.querySelector('input[name="to"]');
    var form = document.querySelector('form');
    var submitBtn = document.querySelector('.submit button');
    var resetBtn = document.querySelector('.results button');
    var results = document.querySelector('.results');
    var distance = document.getElementById('distance');
    var numReqFields = 2;
    var validAirports = false;
    
    var applyError = function(elem) {
        elem.classList.remove('valid');
        elem.classList.add('error');
        submitBtn.setAttribute('disabled', 'disabled');
    };
    
    var checkAirport = function(field) {
        // reset classes
        var classes = field.parentNode.querySelector('.exists').classList;
        while (classes.length > 0) {
            classes.remove(classes.item(0));
        }
        classes.add('exists');

        if(!IntentMedia.Airports.airport_exists(field.value.toUpperCase())) {
            applyError(field);
            classes.add('show');
            validAirports = false;
        } else {
            field.classList.add('valid');
            validAirports = true;
        }
    };
    
    var bindFields = function() {
        /*** regexes ***/
        var charsOnly = /[A-Z]|[a-z]/;
        var validCode = /^([a-z]|[A-Z]){3}$/;


        [].forEach.call(inputs, function(elem) { // querySelectorAll returns NodeList => can't iterate like an array
            elem.addEventListener('keyup', function(e) {
                // reset classes
                elem.classList.remove('valid', 'error');
                elem.parentNode.querySelector('.exists').classList.remove('show');
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
                
                // check if airports exist 
                checkAirport(elem);
                
                // airports cannot be the same
                if(toAirport.value.toUpperCase() === fromAirport.value.toUpperCase()) {
                    toAirport.parentNode.querySelector('.equal').classList.add('show');
                    applyError(toAirport);
                } 

                var validFields = document.querySelectorAll('input.valid');

                if(validFields.length === numReqFields) {
                    submitBtn.removeAttribute('disabled');
                }
            });

        });
    };
    
    var bindSubmitBtn = function() {
        
        submitBtn.addEventListener('click', function(e) {
//            console.log('clicked');
            
            // perform calc
            if(IntentMedia) {
                
                [].forEach.call(inputs, function(elem) {
                    elem.setAttribute('readonly', 'readonly');
                    elem.style.pointerEvents = 'none';
                });

                form.classList.add('calculate');
                results.classList.add('show');

                submitBtn.classList.add('hide');
    
                var theDistance = IntentMedia.Distances.distance_between_airports(fromAirport.value.toUpperCase(), toAirport.value.toUpperCase());
                
                // show the distance on the DOM
                distance.innerHTML = theDistance;
            }
        });  
    };
    
    var bindResetBtn = function() {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // reset all the things!
            [].forEach.call(inputs, function(elem) {
                elem.value = "";    
                elem.classList.remove('valid', 'error');
                elem.style.pointerEvents = 'auto';
                elem.removeAttribute('readonly');
                elem.removeAttribute('disabled');
            });
            
            results.classList.remove('show');
            form.classList.remove('calculate');
            distance.innerHTML = "";
            submitBtn.classList.remove('hide');
            submitBtn.setAttribute('disabled', 'disabled');
        });
    };
    
    var adjustToViewportHeight = function() {
        var height = document.documentElement.clientHeight;
        
        if(height <= 460) {
            results.classList.add('flatten');
        } else {
            results.classList.remove('flatten');
        }
    };
    
    var detectWindowResize = function() {
        window.addEventListener('resize', function() {
            adjustToViewportHeight();
        });
    }
    
    return {
        init: function() {
            adjustToViewportHeight();

            bindFields();
            bindSubmitBtn();
            bindResetBtn();
            
            detectWindowResize();
        }
    };
 
})();

App.init();
