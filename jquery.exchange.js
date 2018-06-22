(function($) {
    $.fn.exchange = function() {
        const apiUrl = 'http://free.currencyconverterapi.com/api/v5/convert?q={from}_{to}&compact=y';
        const $convertBtn = $('#convert');
        const $versaBtn = $('#vice-versa-currency');
        const $fromCurrency = $('#from-currency');
        const $toCurrency = $('#to-currency');
        const $fromValue = $('#from-value');
        const $toValue = this;

        function getValue($elem) {
            return $elem.val();
        }

        function getCurrentURL(apiUrl, from, to) {
            return apiUrl.replace(/{from}/, from).replace(/{to}/, to);
        }

        function calculate(input, coeficient) {
            return input * coeficient;
        }

        function reverseSelects(select1, select2) {
            let select1Val = getValue(select1);
            select1.val(getValue(select2));
            select2.val(select1Val);
        }

        function setResult(apiUrl, fromCurrencyVal, toCurrencyVal, $elem) {
            let url = getCurrentURL(apiUrl, fromCurrencyVal, toCurrencyVal);
            $.getJSON(url, function(data) {
                let currentKey = fromCurrencyVal.toUpperCase() + '_' + toCurrencyVal.toUpperCase();
                let coeficient = data[currentKey].val;
                $elem.html(calculate(getValue($fromValue), coeficient));
            });
        }

        $convertBtn.on('click', function(e) {
            e.preventDefault();
            setResult(apiUrl, getValue($fromCurrency), getValue($toCurrency), $toValue);
        });

        $versaBtn.on('click', function(e) {
            e.preventDefault();
            reverseSelects($fromCurrency, $toCurrency);
            setResult(apiUrl, getValue($fromCurrency), getValue($toCurrency), $toValue);
        });

        $fromCurrency.change(function() {
            setResult(apiUrl, getValue($fromCurrency), getValue($toCurrency), $toValue);
        });

        $toCurrency.change(function() {
            setResult(apiUrl, getValue($fromCurrency), getValue($toCurrency), $toValue);
        });
    };
})(jQuery);
