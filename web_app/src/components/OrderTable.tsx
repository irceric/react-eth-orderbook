import React from "react";
import OrderRow from './OrderRow';

interface OrderBookProps {
  orders: any | undefined,
  type: 'bids' | 'asks'
}

const OrderTable = ({ orders = {}, type = 'bids' }: OrderBookProps): JSX.Element => {
  let firstPrice = orders && Object.keys(orders)[0];
  if (!firstPrice) return <div>Empty</div>;
  const exchangesList = orders && Object.keys(orders[firstPrice]["volumes"]).map((exchangeName) => {
    return <th scope="col">{exchangeName}</th>;
  });

  const orderList = orders && Object.keys(orders).map((price) => {
    return <OrderRow price={price} volumes={orders[price]["volumes"]} highlight={orders[price]["highlight"]} />;
  });

  return (
    <table className="table table-sm table-responsive-md">
      <thead>
        <tr>
          <th scope="col" className="no-top-border"></th>
          <th className="text-center" colSpan={12} scope="col">Volume</th>
        </tr>
        <tr>
          <th scope="col">Price (BTC)</th>
          {exchangesList}
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {orderList}
      </tbody>
    </table>
  );
};

export default OrderTable;
