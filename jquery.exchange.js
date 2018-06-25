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

        $.widget('exchange.rateHistory', {
            options: {
                from: 'UAH',
                to: 'USD',
                days: 8,

                change: null,
            },

            _create() {
                this.element.css({
                    paddingTop: 20,
                    position: 'relative',
                });
                this._refresh();
            },

            _refresh() {
                const dates = this._getDates();
                const exchangeCode = `${this.options.from}_${this.options.to}`;
                const url = `http://free.currencyconverterapi.com/api/v5/convert?q=${exchangeCode}&compact=y&date=${dates[0]}&endDate=${dates[dates.length - 1]}`;
                console.log(url);

                $.getJSON(url).then((response) => {
                    const values = Object.entries(response[exchangeCode].val);

                    this.element.html('');

                    values.forEach((value) => {
                        const maxCurrency = Math.max.apply(Math.max, values.map((value) => value[1]));
                        const minCurrency = Math.min.apply(Math.min, values.map((value) => value[1]));
                        const height = ((value[1] - minCurrency) / (maxCurrency - minCurrency)) * 300 - 20;

                        $('<div>', {'class': 'chart-item'}).css({
                            width: `calc(${100 / this.options.days}% - 10px)`,
                            background: 'blue',
                            height: `${height}`,
                            borderTop: '1px solid #1e5799',
                            marginLeft: 5,
                            marginRight: 5,
                            display: 'inline-block',
                            position: 'relative',
                            background: 'linear-gradient(to bottom, #1e5799 0%,#ffffff 100%)',
                        }).appendTo(this.element).append(
                            $('<div>').html(value[0]).css({
                                position: 'absolute',
                                bottom: -20,
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                            }),
                            $('<div>').html(value[1]).css({
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                top: () => {
                                    if (height <= 19 || height.toString() === 'NaN') {
                                        return 'auto';
                                    } else {
                                        return 0;
                                    }
                                },
                                bottom: () => {
                                    if (height <= 19 || height.toString() === 'NaN') {
                                        return 100 + '%';
                                    } else {
                                        return 'auto';
                                    }
                                },
                                color: () => {
                                    if (height <= 19 || height.toString() === 'NaN') {
                                        return 'black';
                                    } else {
                                        return 'white';
                                    }
                                },
                            }),
                        );
                    });
                });
            },
            _getDates: function() {
                const dates = [];
                for (let i = 0; i < this.options.days; i++) {
                    const today = new Date();
                    const date = new Date(today);

                    date.setDate(today.getDate() - i);
                    dates.unshift(date.toJSON().slice(0, 10));
                }

                return dates;
            },

            _setOptions: function(arguments) {
                this._superApply(arguments);
                this._refresh();
            },

            _destroy() {
                this.element.html('');
            },
        });
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
