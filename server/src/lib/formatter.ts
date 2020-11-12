import {
  Exchange,
  NormalizedOrder,
  OrderType,
  BittrexOrder,
  PoloniexOrderBook,
} from '../types';

const formatData = (data: any): any[] => {
  const homogenizedData = homogenizeResponses(data);
  const bidsData = combineData(homogenizedData, 'bids');
  const asksData = combineData(homogenizedData, 'asks');
  return [bidsData, asksData];
};

const downCase = (data: any) => {
  const lowerCaseData = JSON.stringify(data).toLowerCase();
  return JSON.parse(lowerCaseData);
};

const homogenizeResponses = (data: any) => {
  return downCase(data).map((exchangeData: any) => {
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

const formatBittrex = (data: {
  bid: BittrexOrder[];
  ask: BittrexOrder[];
  name: string;
}) => {
  return {
    name: 'bittrex',
    bids: data.bid.slice(0, 50),
    asks: data.ask.slice(0, 50),
  };
};

const formatPoloniex = (data: PoloniexOrderBook) => {
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

const combineData = (data: any, orderType: OrderType) => {
  const rowData = placeholderRowData(data, orderType);
  data.forEach((exchange: any) => {
    exchange[orderType].forEach((order: NormalizedOrder) => {
      const volumes = 'volumes';
      const highlight = 'highlight';
      rowData[order.rate][volumes][exchange.name] += order.quantity;
      rowData[order.rate][highlight] = highlighting(
        order.rate,
        data,
        orderType,
      );
    });
  });
  return rowData;
};

const sortPrices = (data: any[], orderType: OrderType) => {
  const prices: number[] = [];

  data.forEach((exchange: any) => {
    exchange[orderType].forEach((order: NormalizedOrder) => {
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

const placeholderRowData = (data: any, orderType: OrderType) => {
  const placeholderData: any = {};

  const sortedPrices = sortPrices(data, orderType);

  sortedPrices.forEach((price) => {
    const volPlaceholder: { [key: string]: number } = {};
    data.forEach((exchange: Exchange) => {
      volPlaceholder[exchange.name] = 0;
    });

    placeholderData[price] = {
      volumes: volPlaceholder,
      highlight: false,
    };
  });
  return placeholderData;
};

const highlighting = (price: number, data: any[], orderType: OrderType) => {
  if (orderType === 'asks') {
    return askHighlighting(price, data);
  }
  if (orderType === 'bids') {
    return bidHighlighting(price, data);
  }
};

const askHighlighting = (price: number, data: any[]) => {
  const maxBid = sortPrices(data, 'bids')[0];
  if (price <= maxBid) {
    return 'bg-warning';
  }
};

const bidHighlighting = (price: number, data: any[]) => {
  const minAsk = sortPrices(data, 'asks')[0];
  if (price >= minAsk) {
    return 'bg-warning';
  }
};

export {
  formatData,
  combineData,
  formatBittrex,
  formatPoloniex,
  sortPrices,
  downCase,
  placeholderRowData,
  askHighlighting,
  bidHighlighting,
};
