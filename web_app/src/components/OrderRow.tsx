import React from "react"

interface OrderRowProps {
  volumes: any,
  price: string,
  highlight: string
};

const OrderRow = ({ volumes, price, highlight}: OrderRowProps): JSX.Element => {
  let total = 0
  const exchanges = Object.keys(volumes)
  const formattedVolumes = exchanges.map((exchangeName) => {
    total += volumes[exchangeName]
    return <td>{volumes[exchangeName]}</td>
  })

  return (
    <tr className={highlight}>
      <th scope="row">{price}</th>
      {formattedVolumes}
      <td>{total}</td>
    </tr>
  );
}

export default OrderRow
