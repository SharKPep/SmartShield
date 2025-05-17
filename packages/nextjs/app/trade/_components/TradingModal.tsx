"use client";

import { Dispatch, SetStateAction } from "react";

type Cryptocurrency = {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  image: string;
};

type TradingModalProps = {
  selectedCrypto: Cryptocurrency;
  tradeAmount: string;
  setTradeAmount: Dispatch<SetStateAction<string>>;
  leverage: number;
  setLeverage: Dispatch<SetStateAction<number>>;
  tradeDirection: "long" | "short";
  setTradeDirection: Dispatch<SetStateAction<"long" | "short">>;
  openPosition: () => void;
  setShowTradingModal: Dispatch<SetStateAction<boolean>>;
};

const TradingModal = ({
  selectedCrypto,
  tradeAmount,
  setTradeAmount,
  leverage,
  setLeverage,
  tradeDirection,
  setTradeDirection,
  openPosition,
  setShowTradingModal,
}: TradingModalProps) => {
  return (
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
  );
};

export default TradingModal;
