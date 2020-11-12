import React from "react"

interface MarketDropdownProps {
  onClick: (event: string) => void
};

const MarketDropdown = ({ onClick}: MarketDropdownProps): JSX.Element => {
  const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    onClick(event.currentTarget.value);
  }

  return(
    <form >
    <label> Select Market: </label><br></br>
    <select className="btn btn-light btn-lg" onChange={handleChange} aria-label="select market dropdown">
      <option value="ETH">BTC-ETH</option>
      <option value="DOGE">BTC-DOGE</option>
    </select>
    </form>
  )
}

export default MarketDropdown
