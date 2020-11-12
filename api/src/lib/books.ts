
import { requestAsync } from './requests';
import { formatData } from './formatter';
import { Exchange } from '../types';

const exchanges = [
  { name: 'bittrex', url: 'https://api.bittrex.com/v3/markets/ETH-BTC/orderbook?depth=500' },
  { name: 'poloniex', url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100' },
];

let data = ['', '']

const getOrders = (market: string) => {
  const updatedExchanges = updateUrls(market);

  Promise.all(updatedExchanges.map((exchange: Exchange) => requestAsync(exchange)))
    .then((allData) => {
      data = formatData(allData);
    })
  return data;
}

const updateUrls = (market: string) => {
  const updated = JSON.stringify(exchanges).replace(/ETH/g, market).replace(/eth/g, market.toLowerCase());
  const parsed = JSON.parse(updated);

  if (market === "DOGE") { parsed.splice(3, 1) }

  return parsed;
}


export { getOrders }