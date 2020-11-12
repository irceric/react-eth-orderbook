import React from 'react';
import openSocket from "socket.io-client";

import OrderTable from './components/OrderTable';
import MarketDropdown from './components/MarketDropdown';
import OrderAreaChart from './components/OrderAreaChart';

import './App.css';

const endpoint = "http://localhost:8080";

function App() {
  const [orders, setOrders] = React.useState<any>({});
  const [market, setMarket] = React.useState<string>("ETH");

  React.useEffect(() => {
    newSocketConnection("ETH");
  }, []);

  const handleClick = (market:string) => {
    newSocketConnection(market);
    setMarket(market);
  };
	
  const newSocketConnection = (market:string) => {
    const socket = openSocket(endpoint, {query:`market=${market}`});
    socket.on("orders", (data: any) =>{
      setOrders(data);
    } );
  };

  const renderMarketDropdown = () =>{
    return (
      <MarketDropdown
        onClick={(market: string) => handleClick(market)}
      />
    );
  };
	
  return (
    <div className="container-fluid text-center">
      <br></br>
      <h3>Order Book Test Project</h3><br></br>
      <h4 className="blue-text">BTC-{market} Market</h4><br></br>
      <h5>{renderMarketDropdown()}</h5>
      <div className="col-md-10 offset-md-1 text-center">
        <OrderAreaChart orders={orders} market={market} />
      </div>
      <div className="col-md-6 offset-md-3"><br></br><br></br>
        <h5 className= "text-center font-italic bg-warning">Highlighting Represents Overlapping Asks/Bids</h5><br></br>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3 className = "text-center">Bids</h3>
          <OrderTable type="bids" orders={orders[0]}/>
        </div>
        <div className="col-md-6">
          <h3 className = "text-center">Asks</h3>
          <OrderTable type="asks" orders={orders[1]}/>
        </div>
      </div>
    </div>
  );
}

export default App;

