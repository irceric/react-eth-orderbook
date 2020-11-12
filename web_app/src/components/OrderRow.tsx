import React from "react";

interface OrderRowProps {
  volumes: any,
  price: string,
  highlight: string
}

const OrderRow = ({ volumes, price, highlight}: OrderRowProps): JSX.Element => {
  let total = 0.0;
  const exchanges = Object.keys(volumes);
  const formattedVolumes = exchanges.map((exchangeName, index) => {
    total += volumes[exchangeName] * 0.1;
    return <td key={index}>{volumes[exchangeName]}</td>;
  });

  return (
    <tr className={highlight}>
      <th scope="row">{price}</th>
      {formattedVolumes}
      <td>{total.toFixed(4)}</td>
    </tr>
  );
};

export default OrderRow;
