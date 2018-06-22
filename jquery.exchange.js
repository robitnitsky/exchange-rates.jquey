(function($) {
    $.fn.exchange = function(options) {
        let opts = $.extend({}, $.fn.exchange.defaults, options);
        const self = this;
        init();

        function init() {
            findElements();
            attachEvents();
        }

        function findElements() {
            opts.$convertBtn = $(opts.convertBtn);
            opts.$viceVersaBtn = $(opts.viceVersaBtn);
            opts.$fromCurrencySelectEl = $(opts.fromCurrencySelectEl);
            opts.$toCurrencySelectEl = $(opts.toCurrencySelectEl);
            opts.$fromValueEl = $(opts.fromValueEl);
        }

        function attachEvents() {
            opts.$convertBtn.on('click', (e) => {
                e.preventDefault();
                setResult(opts.apiUrl, getValue(opts.$fromCurrencySelectEl), getValue(opts.$toCurrencySelectEl), self);
            });

            opts.$viceVersaBtn.on('click', (e) => {
                e.preventDefault();
                reverseSelects(opts.$fromCurrencySelectEl, opts.$toCurrencySelectEl);
                setResult(opts.apiUrl, getValue(opts.$fromCurrencySelectEl), getValue(opts.$toCurrencySelectEl), self);
            });

            opts.$fromCurrencySelectEl.change(() => {
                setResult(opts.apiUrl, getValue(opts.$fromCurrencySelectEl), getValue(opts.$toCurrencySelectEl), self);
            });

            opts.$toCurrencySelectEl.change(() => {
                setResult(opts.apiUrl, getValue(opts.$fromCurrencySelectEl), getValue(opts.$toCurrencySelectEl), self);
            });
        }

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

        function setResult(apiUrl, fromCurrencyVal, toCurrencyVal, self) {
            let url = getCurrentURL(apiUrl, fromCurrencyVal, toCurrencyVal);
            $.getJSON(url, function(data) {
                let currentKey = fromCurrencyVal.toUpperCase() + '_' + toCurrencyVal.toUpperCase();
                let coeficient = data[currentKey].val;
                $(self).html(calculate(getValue(opts.$fromValueEl), coeficient));
            });
        }
    };

    $.fn.exchange.defaults = {
        apiUrl: 'http://free.currencyconverterapi.com/api/v5/convert?q={from}_{to}&compact=y',
        convertBtn: '#convert',
        viceVersaBtn: '#vice-versa-currency',
        fromCurrencySelectEl: '#from-currency',
        toCurrencySelectEl: '#to-currency',
        fromValueEl: '#from-value',
    };
})(jQuery);
