import React from "react"
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Legend } from 'recharts';

interface OrderAreaProps {
  orders: any,
  market: string,
}

const OrderAreaChart = ({ orders, market }: OrderAreaProps): JSX.Element => {

  const roundIncrement = (price: number): number => {
    return + (Math.round(price * 2000) / 2000).toFixed(4);
  }

  let data: any[] = [];

  if (orders[0] && market === 'ETH') {
    let bids = orders[0]
    let asks = orders[1]
    let min = + roundIncrement(+Object.keys(bids).slice(-1)[0])
    let max = + Object.keys(asks).slice(-1)[0]
    let smoothedData: {
      [key: string]: any
    } = {};

    let i = min
    while (i <= max + .0005) {
      smoothedData[roundIncrement(i)] = { 'bid': 0, 'ask': 0 }
      i = +roundIncrement(i) + .0005
    }
    Object.keys(bids).forEach((price) => {
      let totalVol = 0
      let roundedPx = roundIncrement(+price)
      Object.keys(bids[price].volumes).forEach((exchangeName) => {
        totalVol += bids[price].volumes[exchangeName]
      })
      smoothedData[roundedPx]['bid'] += totalVol
    })

    Object.keys(asks).forEach((price) => {
      let totalVol = 0
      let roundedPx = roundIncrement(+price)
      Object.keys(asks[price].volumes).forEach((exchangeName) => {
        totalVol += asks[price].volumes[exchangeName]
      })
      smoothedData[roundedPx]['ask'] += totalVol
    })

    data = Object.keys(smoothedData).map(function (price) {
      return { price: +price, bid: smoothedData[price]['bid'], ask: smoothedData[price]['ask'] }
    })
  } else {
    if (orders[0]) {
      let bids = orders[0]
      Object.keys(bids).forEach(function (price) {
        let totalVol = 0
        Object.keys(bids[price].volumes).forEach((exchangeName) => {
          totalVol += bids[price].volumes[exchangeName]
        })
        data.push({ price: + price, bid: totalVol })
      })

      let asks = orders[1]
      Object.keys(asks).forEach(function (price) {
        let totalVol = 0
        Object.keys(asks[price].volumes).forEach((exchangeName) => {
          totalVol += asks[price].volumes[exchangeName]
        })
        data.push({ price: + price, ask: totalVol })
      })


      data.sort(function (a, b) {
        return a.price - b.price
      })
    }
  }

  return (

    <AreaChart width={1000} height={250} data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#F4442E" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#F4442E" stopOpacity={0.5} />
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#99F7AB" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#99F7AB" stopOpacity={.5} />
        </linearGradient>
      </defs>
      <XAxis dataKey="price" type="number" allowDataOverflow={true} domain={['dataMin', 'dataMax']} />
      <YAxis allowDataOverflow={true} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
      <Area type="monotone" dataKey="bid" stroke="#F4442E" fillOpacity={1} fill="url(#colorUv)" connectNulls={true} />
      <Area type="monotone" dataKey="ask" stroke="#99F7AB" fillOpacity={1} fill="url(#colorPv)" connectNulls={true} />
    </AreaChart>
  )
}

export default OrderAreaChart
