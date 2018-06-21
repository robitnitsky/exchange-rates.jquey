(function($) {
    const apiUrl = 'http://free.currencyconverterapi.com/api/v5/convert?q={from}_{to}&compact=y';
    const $convertBtn = $('#convert');
    const $fromCurrency = $('#from-currency');
    const $toCurrency = $('#to-currency');
    const $toValue = $('#to-value');

    function getValue($elem) {
        return $elem.val();
    }

    function getCurrentURL(apiUrl, from, to) {
        return apiUrl.replace(/{from}/, from).replace(/{to}/, to);
    }

    function setCurrentJSON(url, $elem) {
        $.getJSON(url, function(data) {
            $elem.html(JSON.stringify(data));
        });
    }

    $convertBtn.on('click', function(e) {
        e.preventDefault();
        let fromCurrencyVal = getValue($fromCurrency);
        let toCurrencyVal = getValue($toCurrency);

        setCurrentJSON(getCurrentURL(apiUrl, fromCurrencyVal, toCurrencyVal), $toValue);
    });
})(jQuery);
