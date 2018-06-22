(function($) {
    $.fn.exchange = function(options) {
        const self = this;

        let opts = $.extend({}, $.fn.exchange.defaults, options);

        let methods = {
            init: () => {
                methods.findElements();
                methods.attachEvents();
            },

            findElements: () => {
                opts.$convertBtn = $(opts.convertBtn);
                opts.$viceVersaBtn = $(opts.viceVersaBtn);
                opts.$fromCurrencySelectEl = $(opts.fromCurrencySelectEl);
                opts.$toCurrencySelectEl = $(opts.toCurrencySelectEl);
                opts.$fromValueEl = $(opts.fromValueEl);
            },

            attachEvents: () => {
                opts.$convertBtn.on('click', (e) => {
                    e.preventDefault();
                    methods.setResult(opts.apiUrl, methods.getValue(opts.$fromCurrencySelectEl), methods.getValue(opts.$toCurrencySelectEl), self);
                });

                opts.$viceVersaBtn.on('click', (e) => {
                    e.preventDefault();
                    methods.reverseSelects(opts.$fromCurrencySelectEl, opts.$toCurrencySelectEl);
                    methods.setResult(opts.apiUrl, methods.getValue(opts.$fromCurrencySelectEl), methods.getValue(opts.$toCurrencySelectEl), self);
                });

                opts.$fromCurrencySelectEl.change(() => {
                    methods.setResult(opts.apiUrl, methods.getValue(opts.$fromCurrencySelectEl), methods.getValue(opts.$toCurrencySelectEl), self);
                });

                opts.$toCurrencySelectEl.change(() => {
                    methods.setResult(opts.apiUrl, methods.getValue(opts.$fromCurrencySelectEl), methods.getValue(opts.$toCurrencySelectEl), self);
                });
            },

            getValue: ($elem) => {
                return $elem.val();
            },

            getCurrentURL: (apiUrl, from, to) => {
                return apiUrl.replace(/{from}/, from).replace(/{to}/, to);
            },

            calculate: (input, coeficient) => {
                return input * coeficient;
            },

            reverseSelects: (select1, select2) => {
                let select1Val = methods.getValue(select1);
                select1.val(methods.getValue(select2));
                select2.val(select1Val);
            },

            setResult: (apiUrl, fromCurrencyVal, toCurrencyVal, self) => {
                let url = methods.getCurrentURL(apiUrl, fromCurrencyVal, toCurrencyVal);
                $.getJSON(url, function(data) {
                    let currentKey = fromCurrencyVal.toUpperCase() + '_' + toCurrencyVal.toUpperCase();
                    let coeficient = data[currentKey].val;
                    $(self).html(methods.calculate(methods.getValue(opts.$fromValueEl), coeficient));
                });
            },
        };

        methods.init();

        return this;
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
