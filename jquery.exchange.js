(function($) {
    let toValue = $('#to-value');
    $.getJSON('http://free.currencyconverterapi.com/api/v5/convert?q=UAH_USD&compact=y', function(data) {
        let dataStr = JSON.stringify(data);
        toValue.html(dataStr);
    });
})(jQuery);
