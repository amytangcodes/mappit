const currencyFormatter = require('currency-formatter');

function currency(value) {
    return currencyFormatter.format(value, { code: 'CAD' });
}

export default currency;
