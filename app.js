var App = App || {};

App = (function() {
    var inputs = document.querySelectorAll('input');
    var form = document.querySelector('form');
    var button = document.querySelector('.submit button');
    var results = document.querySelector('.results');
    var distance = document.getElementById('distance');
    
    var bindFields = function() {
        /*** regexes ***/
        var charsOnly = /[A-Z]|[a-z]/;
        var validCode = /^([a-z]|[A-Z]){3}$/;

        var numReqFields = 2;

        var applyError = function(elem) {
            elem.classList.add('error');
            button.setAttribute('disabled', 'disabled');
        };

        [].forEach.call(inputs, function(elem) { // querySelectorAll returns NodeList => can't iterate like an array
            elem.addEventListener('keyup', function(e) {
                // reset <field>'s class
                elem.classList = "";

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

                var validFields = document.querySelectorAll('input.valid');

    //            console.log('validFields', validFields.length);

                if(validFields.length === numReqFields) {
                    button.removeAttribute('disabled');
                }
            });

        });
    };
    
    var bindButton = function() {
        button.addEventListener('click', function() {
            console.log('clicked');
            
            [].forEach.call(inputs, function(elem) {
                elem.setAttribute('readonly', 'readonly');
                elem.style.pointerEvents = 'none';
            });
            
            form.classList.add('calculate');
            results.classList.add('show');
            
            button.classList.add('hide');
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
