"use client";

import { Dispatch, SetStateAction, useState } from "react";

const insuranceFeePercentage = 0.1;

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
  hasInsurance?: boolean;
  setHasInsurance?: Dispatch<SetStateAction<boolean>>;
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
  hasInsurance = false,
  setHasInsurance,
}: TradingModalProps) => {
  // Use internal state if no external state management is provided
  const [localHasInsurance, setLocalHasInsurance] = useState(hasInsurance);

  // Calculate insurance fee
  const insuranceFee = parseFloat(tradeAmount || "0") * insuranceFeePercentage;

  // Use either the prop setter if available or the local state
  const handleInsuranceChange = (checked: boolean) => {
    if (setHasInsurance) {
      setHasInsurance(checked);
    } else {
      setLocalHasInsurance(checked);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-base-200 p-6 pt-4 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 py-2">
          <h3 className="text-xl font-bold">
            Trade {selectedCrypto.name} ({selectedCrypto.symbol})
          </h3>
          <button
            className="btn btn-circle btn-sm btn-error text-white font-bold"
            onClick={() => setShowTradingModal(false)}
            aria-label="Close"
          >
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
            <p className="text-2xl font-bold">
              ${selectedCrypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={selectedCrypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
              {selectedCrypto.priceChange24h >= 0 ? "+" : ""}
              {selectedCrypto.priceChange24h.toFixed(2)}%
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
            onChange={e => setTradeAmount(e.target.value)}
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
              onChange={e => setLeverage(parseInt(e.target.value))}
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
              className={`btn flex-1 ${tradeDirection === "long" ? "btn-success" : "btn-outline"}`}
              onClick={() => setTradeDirection("long")}
            >
              Long
            </button>
            <button
              className={`btn flex-1 ${tradeDirection === "short" ? "btn-error" : "btn-outline"}`}
              onClick={() => setTradeDirection("short")}
            >
              Short
            </button>
          </div>
        </div>{" "}
        {/* Insurance Option */}
        <div className="form-control mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={setHasInsurance ? hasInsurance : localHasInsurance}
              onChange={e => handleInsuranceChange(e.target.checked)}
            />
            <span className="label-text">Add Liquidation Insurance (10% of margin)</span>
          </label>
          {(setHasInsurance ? hasInsurance : localHasInsurance) && (
            <div className="mt-2 text-sm bg-base-100 p-2 rounded-md">
              <p>
                Insurance fee: <span className="font-medium">${insuranceFee.toFixed(2)}</span>
              </p>
              <p className="text-xs text-info mt-1">Insurance compensates for liquidated positions only</p>
            </div>
          )}
        </div>
        {/* Summary */}
        <div className="bg-base-300 p-4 rounded-lg mb-6">
          <h4 className="font-bold mb-2">Trade Summary</h4>
          <div className="grid grid-cols-2 gap-2">
            <p>Position Size:</p>
            <p className="text-right">${parseFloat(tradeAmount || "0").toLocaleString()}</p>
            <p>Leverage:</p>
            <p className="text-right">{leverage}x</p> <p>Total Position Value:</p>
            <p className="text-right">${(parseFloat(tradeAmount || "0") * leverage).toLocaleString()}</p>
            {(setHasInsurance ? hasInsurance : localHasInsurance) && (
              <>
                <p>Insurance Fee:</p>
                <p className="text-right">${insuranceFee.toLocaleString()}</p>
                <p>Total Payment:</p>
                <p className="text-right">${(parseFloat(tradeAmount || "0") + insuranceFee).toLocaleString()}</p>
              </>
            )}
            <p>Est. Liquidation Price:</p>
            <p className="text-right">
              $
              {tradeDirection === "long"
                ? (selectedCrypto.price * (1 - (1 / leverage) * 0.95)).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : (selectedCrypto.price * (1 + (1 / leverage) * 0.95)).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
            </p>
          </div>
        </div>{" "}
        {(setHasInsurance ? hasInsurance : localHasInsurance) && (
          <div className="bg-base-300 p-4 rounded-lg mb-6">
            <h4 className="font-bold mb-2">Insurance Compensation Information</h4>
            <div className="text-xs space-y-1">
              <p>• Compensation processed every Monday at 00:00 UTC</p>
              <p>• Only liquidated positions are eligible for compensation</p>
              <p>• Manually closed positions receive no compensation</p>
              <p>• Compensation is proportional to insurance purchased</p>
              <p>• Maximum compensation cannot exceed total margin amount</p>
            </div>
          </div>
        )}
        <div className="flex space-x-4">
          <button className="btn btn-outline flex-1" onClick={() => setShowTradingModal(false)}>
            Cancel
          </button>{" "}
          <button
            className={`btn flex-1 ${tradeDirection === "long" ? "btn-success" : "btn-error"}`}
            onClick={() => {
              // Pass insurance information to the openPosition function if needed
              // This assumes openPosition can handle the insurance information
              openPosition();
            }}
            disabled={parseFloat(tradeAmount) <= 0}
          >
            {tradeDirection === "long" ? "Buy / Long" : "Sell / Short"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingModal;
