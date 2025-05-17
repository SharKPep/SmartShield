"use client";

import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { useInterval } from "usehooks-ts";

type Cryptocurrency = {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  image: string;
};

type Position = {
  id: string;
  symbol: string;
  entryPrice: number;
  leverage: number;
  amount: number;
  direction: "long" | "short";
  pnl: number;
  liquidationPrice: number;
};

const urlPrefix = "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/refs/heads/mainx/SVG"

const TradePage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([
    { symbol: "BTC", name: "Bitcoin", price: 0, priceChange24h: 0, image: urlPrefix + "/btc.svg" },
    { symbol: "ETH", name: "Ethereum", price: 0, priceChange24h: 0, image: "https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png" },
    { symbol: "SOL", name: "Solana", price: 0, priceChange24h: 0, image: urlPrefix + "/sol.svg" },
    { symbol: "BNB", name: "Binance Coin", price: 0, priceChange24h: 0, image: urlPrefix + "/bnb.svg" },
    { symbol: "DOGE", name: "Dogecoin", price: 0, priceChange24h: 0, image: urlPrefix + "/doge.svg" },
  ]);
  
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>("0");
  const [leverage, setLeverage] = useState<number>(1);
  const [tradeDirection, setTradeDirection] = useState<"long" | "short">("long");
  const [positions, setPositions] = useState<Position[]>([]);
  const [showTradingModal, setShowTradingModal] = useState<boolean>(false);

  // Simulate fetching cryptocurrency prices
  const fetchCryptoPrices = async () => {
    try {
      // In a real application, you'd use a proper API
      // For this demo, we'll simulate price changes
      setCryptocurrencies(prev => prev.map(crypto => ({
        ...crypto,
        price: updateSimulatedPrice(crypto.price || getInitialPrice(crypto.symbol)),
        priceChange24h: Math.random() * 6 - 3, // Random value between -3% and +3%
      })));
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

  // Helper function to get initial simulated prices
  const getInitialPrice = (symbol: string): number => {
    switch(symbol) {
      case "BTC": return 65000 + Math.random() * 2000;
      case "ETH": return 3500 + Math.random() * 200;
      case "SOL": return 150 + Math.random() * 20;
      case "BNB": return 600 + Math.random() * 30;
      case "DOGE": return 0.15 + Math.random() * 0.02;
      default: return 100;
    }
  };

  // Simulate price movement
  const updateSimulatedPrice = (currentPrice: number): number => {
    const changePercent = (Math.random() * 0.4) - 0.2; // -0.2% to +0.2%
    return currentPrice * (1 + changePercent / 100);
  };

  // Initial price fetch
  useEffect(() => {
    fetchCryptoPrices();
    // Set the first crypto as selected by default
    if (cryptocurrencies.length > 0 && !selectedCrypto) {
      setSelectedCrypto(cryptocurrencies[0]);
    }
  }, []);

  // Update prices periodically
  useInterval(() => {
    fetchCryptoPrices();
    // Also update PnL for open positions
    updatePositionsPnl();
  }, 5000);

  // Update PnL for all positions
  const updatePositionsPnl = () => {
    if (positions.length === 0) return;
    
    setPositions(positions.map(position => {
      const currentPrice = cryptocurrencies.find(c => c.symbol === position.symbol)?.price || position.entryPrice;
      let pnl = 0;
      
      if (position.direction === "long") {
        pnl = (currentPrice - position.entryPrice) * position.amount * position.leverage;
      } else {
        pnl = (position.entryPrice - currentPrice) * position.amount * position.leverage;
      }
      
      return { ...position, pnl };
    }));
  };

  // Handle opening a new position
  const openPosition = () => {
    if (!selectedCrypto || parseFloat(tradeAmount) <= 0) return;
    
    const amount = parseFloat(tradeAmount);
    const entryPrice = selectedCrypto.price;
    
    // Calculate liquidation price (simplified)
    let liquidationPrice;
    if (tradeDirection === "long") {
      liquidationPrice = entryPrice * (1 - (1 / leverage) * 0.95); // 95% of margin used up
    } else {
      liquidationPrice = entryPrice * (1 + (1 / leverage) * 0.95);
    }
    
    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      symbol: selectedCrypto.symbol,
      entryPrice,
      leverage,
      amount,
      direction: tradeDirection,
      pnl: 0,
      liquidationPrice,
    };
    
    setPositions([...positions, newPosition]);
    setShowTradingModal(false);
  };

  // Handle closing a position
  const closePosition = (positionId: string) => {
    setPositions(positions.filter(p => p.id !== positionId));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Perpetual Contract Trading</h1>
      
      {/* Cryptocurrency Price Table */}
      <div className="overflow-x-auto mb-8">
        <table className="table w-full">
          <thead>
            <tr className="text-base">
              <th>Cryptocurrency</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cryptocurrencies.map((crypto) => (
              <tr key={crypto.symbol} className="hover">
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <img src={crypto.image} alt={crypto.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{crypto.name}</div>
                      <div className="text-sm opacity-70">{crypto.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="font-mono">
                  ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>
                  <div className={`flex items-center ${crypto.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.priceChange24h >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                    {Math.abs(crypto.priceChange24h).toFixed(2)}%
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedCrypto(crypto);
                      setShowTradingModal(true);
                    }}
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Open Positions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Positions</h2>
        {positions.length === 0 ? (
          <div className="alert">
            <p>No open positions. Start trading to open positions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Direction</th>
                  <th>Size</th>
                  <th>Entry Price</th>
                  <th>Leverage</th>
                  <th>PnL</th>
                  <th>Liquidation Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const currentPrice = cryptocurrencies.find(c => c.symbol === position.symbol)?.price || position.entryPrice;
                  const pnlPercentage = (position.pnl / (position.amount * position.entryPrice)) * 100;
                  
                  return (
                    <tr key={position.id}>
                      <td>{position.symbol}</td>
                      <td className={position.direction === "long" ? "text-green-500" : "text-red-500"}>
                        {position.direction.toUpperCase()}
                      </td>
                      <td>${(position.amount * position.entryPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>${position.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{position.leverage}x</td>
                      <td className={position.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                        ${position.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="block text-xs">({pnlPercentage.toFixed(2)}%)</span>
                      </td>
                      <td>${position.liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        <button className="btn btn-sm btn-error" onClick={() => closePosition(position.id)}>
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trading Modal */}
      {showTradingModal && selectedCrypto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-base-200 p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Trade {selectedCrypto.name} ({selectedCrypto.symbol})
              </h3>
              <button className="btn btn-sm btn-circle" onClick={() => setShowTradingModal(false)}>
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full">
                  <img src={selectedCrypto.image} alt={selectedCrypto.name} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">${selectedCrypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className={selectedCrypto.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {selectedCrypto.priceChange24h >= 0 ? '+' : ''}{selectedCrypto.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Trade Amount (USD)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                min="0"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Leverage (1-10x)</span>
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="range range-primary range-md mr-4"
                />
                <span className="text-lg font-bold">{leverage}x</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Position Direction</span>
              </label>
              <div className="flex space-x-4">
                <button
                  className={`btn flex-1 ${tradeDirection === 'long' ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setTradeDirection('long')}
                >
                  Long
                </button>
                <button
                  className={`btn flex-1 ${tradeDirection === 'short' ? 'btn-error' : 'btn-outline'}`}
                  onClick={() => setTradeDirection('short')}
                >
                  Short
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-base-300 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2">Trade Summary</h4>
              <div className="grid grid-cols-2 gap-2">
                <p>Position Size:</p>
                <p className="text-right">${parseFloat(tradeAmount || "0").toLocaleString()}</p>
                <p>Leverage:</p>
                <p className="text-right">{leverage}x</p>
                <p>Total Position Value:</p>
                <p className="text-right">${(parseFloat(tradeAmount || "0") * leverage).toLocaleString()}</p>
                <p>Est. Liquidation Price:</p>
                <p className="text-right">
                  ${tradeDirection === 'long' 
                    ? (selectedCrypto.price * (1 - (1 / leverage) * 0.95)).toLocaleString(undefined, { maximumFractionDigits: 2 })
                    : (selectedCrypto.price * (1 + (1 / leverage) * 0.95)).toLocaleString(undefined, { maximumFractionDigits: 2 })
                  }
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="btn btn-outline flex-1" onClick={() => setShowTradingModal(false)}>
                Cancel
              </button>
              <button 
                className={`btn flex-1 ${tradeDirection === 'long' ? 'btn-success' : 'btn-error'}`}
                onClick={openPosition}
                disabled={parseFloat(tradeAmount) <= 0}
              >
                {tradeDirection === 'long' ? 'Buy / Long' : 'Sell / Short'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradePage;