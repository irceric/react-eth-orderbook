"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidHighlighting = exports.askHighlighting = exports.placeholderRowData = exports.downCase = exports.sortPrices = exports.formatPoloniex = exports.formatBittrex = exports.combineData = exports.formatData = void 0;
const formatData = (data) => {
    const homogenizedData = homogenizeResponses(data);
    const bidsData = combineData(homogenizedData, 'bids');
    const asksData = combineData(homogenizedData, 'asks');
    return [bidsData, asksData];
};
exports.formatData = formatData;
const downCase = (data) => {
    const lowerCaseData = JSON.stringify(data).toLowerCase();
    return JSON.parse(lowerCaseData);
};
exports.downCase = downCase;
const homogenizeResponses = (data) => {
    return downCase(data).map((exchangeData) => {
        switch (exchangeData.name) {
            case 'bittrex':
                return formatBittrex(exchangeData);
            case 'poloniex':
                return formatPoloniex(exchangeData);
            default:
                return formatPoloniex(exchangeData);
        }
    });
};
const formatBittrex = (data) => {
    return {
        name: 'bittrex',
        bids: data.bid.slice(0, 50),
        asks: data.ask.slice(0, 50),
    };
};
exports.formatBittrex = formatBittrex;
const formatPoloniex = (data) => {
    const bids = data.bids.map((bid) => ({
        rate: bid[0],
        quantity: bid[1],
    }));
    const asks = data.asks.map((bid) => ({
        rate: bid[0],
        quantity: bid[1],
    }));
    return {
        name: 'poloniex',
        bids,
        asks,
    };
};
exports.formatPoloniex = formatPoloniex;
const combineData = (data, orderType) => {
    const rowData = placeholderRowData(data, orderType);
    data.forEach((exchange) => {
        exchange[orderType].forEach((order) => {
            const volumes = 'volumes';
            const highlight = 'highlight';
            rowData[order.rate][volumes][exchange.name] += order.quantity;
            rowData[order.rate][highlight] = highlighting(order.rate, data, orderType);
        });
    });
    return rowData;
};
exports.combineData = combineData;
const sortPrices = (data, orderType) => {
    const prices = [];
    data.forEach((exchange) => {
        exchange[orderType].forEach((order) => {
            prices.push(order.rate);
        });
    });
    if (orderType === 'bids') {
        return prices.sort().reverse();
    }
    if (orderType === 'asks') {
        return prices.sort();
    }
};
exports.sortPrices = sortPrices;
const placeholderRowData = (data, orderType) => {
    const placeholderData = {};
    const sortedPrices = sortPrices(data, orderType);
    sortedPrices.forEach((price) => {
        const volPlaceholder = {};
        data.forEach((exchange) => {
            volPlaceholder[exchange.name] = 0;
        });
        placeholderData[price] = {
            volumes: volPlaceholder,
            highlight: false,
        };
    });
    return placeholderData;
};
exports.placeholderRowData = placeholderRowData;
const highlighting = (price, data, orderType) => {
    if (orderType === 'asks') {
        return askHighlighting(price, data);
    }
    if (orderType === 'bids') {
        return bidHighlighting(price, data);
    }
};
const askHighlighting = (price, data) => {
    const maxBid = sortPrices(data, 'bids')[0];
    if (price <= maxBid) {
        return 'bg-warning';
    }
};
exports.askHighlighting = askHighlighting;
const bidHighlighting = (price, data) => {
    const minAsk = sortPrices(data, 'asks')[0];
    if (price >= minAsk) {
        return 'bg-warning';
    }
};
exports.bidHighlighting = bidHighlighting;
//# sourceMappingURL=formatter.js.map