var App = App || {};

App = (function() {
    /******* initial properties *******/
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
    
    
    /******* helper functions ******/
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

        if(IntentMedia) { // check to make sure IntentMedia object exists
            if(!IntentMedia.Airports.airport_exists(field.value.toUpperCase())) { // if airport does not exist
                applyError(field);
                classes.add('show');
                validAirports = false;
            } else {
                field.classList.add('valid');
                validAirports = true;
            }    
        }
    };
    
    var bindFields = function() {
        [].forEach.call(inputs, function(elem) { // querySelectorAll returns NodeList => can't iterate like an array
            elem.addEventListener('keyup', function(e) {
                // reset classes
                elem.classList.remove('valid', 'error');
                elem.parentNode.querySelector('.exists').classList.remove('show');
                toAirport.parentNode.querySelector('.equal').classList.remove('show');

                // check if airports exist 
                checkAirport(elem);
                
                // airports cannot be the same
                if(toAirport.value.toUpperCase() === fromAirport.value.toUpperCase()) {
                    toAirport.parentNode.querySelector('.equal').classList.add('show');
                    applyError(toAirport);
                } 
                
                // enable submit button if both fields are valid
                var validFields = document.querySelectorAll('input.valid');
                if(validFields.length === numReqFields) {
                    submitBtn.removeAttribute('disabled');
                }
            });
        });
    };
    
    var bindSubmitBtn = function() {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // perform calc
            if(IntentMedia) { // check existence first
                
                [].forEach.call(inputs, function(elem) { // disable interaction with fields through calc process
                    elem.setAttribute('readonly', 'readonly');
                    elem.style.pointerEvents = 'none';
                });

                // show results container and hide the submit button to prevent bugs caused by further interaction with non reset button elems
                form.classList.add('calculate');
                results.classList.add('show');
                resetBtn.removeAttribute('disabled');

                submitBtn.classList.add('hide');
    
                // get the distance
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
            resetBtn.setAttribute('disabled', 'disabled');
        });
    };
    
    var adjustToViewportHeight = function() {
        var height = document.documentElement.clientHeight;
        
        // adjust results container based on viewport height
        if(height <= 460) {
            results.classList.add('flatten');
        } else {
            results.classList.remove('flatten');
        }
    };
    
    var detectWindowResize = function() {
        // window resize should trigger adjustment to viewport height
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
