"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const requests_1 = require("./requests");
const formatter_1 = require("./formatter");
const exchanges = [
    {
        name: 'bittrex',
        url: 'https://api.bittrex.com/v3/markets/ETH-BTC/orderbook?depth=500',
    },
    {
        name: 'poloniex',
        url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100',
    },
];
let data = ['', ''];
const getOrders = (market) => {
    const updatedExchanges = updateUrls(market);
    Promise.all(updatedExchanges.map((exchange) => requests_1.requestAsync(exchange))).then((allData) => {
        data = formatter_1.formatData(allData);
    });
    return data;
};
exports.getOrders = getOrders;
const updateUrls = (market) => {
    const updated = JSON.stringify(exchanges)
        .replace(/ETH/g, market)
        .replace(/eth/g, market.toLowerCase());
    const parsed = JSON.parse(updated);
    if (market === 'DOGE') {
        parsed.splice(3, 1);
    }
    return parsed;
};
//# sourceMappingURL=books.js.map