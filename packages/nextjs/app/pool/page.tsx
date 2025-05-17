"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { FaChartLine, FaChevronDown, FaChevronUp, FaExchangeAlt, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";
import { MdAutorenew, MdWaterDrop } from "react-icons/md";

type PoolData = {
  name: string;
  description: string;
  balance: number;
  apy: number;
  totalInsured: number;
  level: number;
  color: string;
  icon: JSX.Element;
  expanded?: boolean;
};

const PoolPage = () => {
  // Sample data for the three liquidity pools
  const [pools, setPools] = useState<PoolData[]>([
    {
      name: "保险赔偿池 (Level 0)",
      description: "所有的保险费进入保险赔偿池，等待合约平仓",
      balance: 158400,
      apy: 0,
      totalInsured: 325000,
      level: 0,
      color: "blue",
      icon: <FaShieldAlt className="text-blue-500 text-2xl" />,
      expanded: false,
    },
    {
      name: "Agent投资池 (Level 1)",
      description: "平仓后保险金额和赔付后剩余的保险金额进入Level 1投资池，用于投资获取收益",
      balance: 89750,
      apy: 5.8,
      totalInsured: 215000,
      level: 1,
      color: "green",
      icon: <FaMoneyBillWave className="text-green-500 text-2xl" />,
      expanded: false,
    },
    {
      name: "Agent投资池 (Level 2)",
      description: "超过未平仓金额的合约保证金部分流动性，长期积累获取分红",
      balance: 42500,
      apy: 8.2,
      totalInsured: 125000,
      level: 2,
      color: "purple",
      icon: <FaChartLine className="text-purple-500 text-2xl" />,
      expanded: false,
    },
  ]);

  const [animationActive, setAnimationActive] = useState(false);
  const flowControls = useAnimation();

  // Toggle expanded state for a pool
  const toggleExpand = (poolLevel: number) => {
    setPools(pools.map(pool => (pool.level === poolLevel ? { ...pool, expanded: !pool.expanded } : pool)));
  };

  // Function to stake in a pool (placeholder)
  const stakeInPool = (poolLevel: number) => {
    alert(`Staking in Level ${poolLevel} pool will be implemented soon`);
  };
  // Function to withdraw from a pool (placeholder)
  const withdrawFromPool = (poolLevel: number) => {
    alert(`Withdrawal from Level ${poolLevel} pool will be implemented soon`);
  };

  // Animate the flow of funds
  const triggerFlowAnimation = () => {
    setAnimationActive(true);
    flowControls
      .start({
        x: [0, 100, 200],
        y: [0, 50, 100],
        opacity: [1, 1, 0],
        transition: { duration: 2, repeat: 0 },
      })
      .then(() => {
        setAnimationActive(false);
      });
  };

  // Effect for initial animation
  useEffect(() => {
    // Trigger the animation after a short delay when component mounts
    const timer = setTimeout(() => {
      triggerFlowAnimation();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Liquidity Pool</h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">流动性池资金流转机制</h2>
        <div className="bg-base-200 p-6 rounded-lg">
          <ol className="list-decimal ml-6 space-y-3">
            <li>
              用户按照保险计算规则进行保险购买后，保险进入<strong>Level 0 保险赔偿池</strong>
              。在这个赔偿池中，用户的保险金额保留在这里，等待平仓。
            </li>
            <li>
              平仓后保险金额进入<strong>Level 1 Agent投资池</strong>
              ，五倍杠杆下的平仓金额所带来的保险费收益远大于爆仓金额。在Level 1的流动性可以质押收益。
            </li>
            <li>
              同时，超过未平仓金额的合约保证金部分流动性进入<strong>Level 2 Agent投资池</strong>
              。该投资池的流动性依然是逐渐积累的，不断积累以获取更多的分红，激励保险用户。
            </li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool, index) => (
          <div
            key={index}
            className={`card bg-base-200 shadow-xl ${
              pool.level === 0
                ? "border-l-4 border-blue-500"
                : pool.level === 1
                  ? "border-l-4 border-green-500"
                  : "border-l-4 border-purple-500"
            }`}
          >
            <div className="card-body">
              <h2 className="card-title">
                {pool.name}
                {pool.apy > 0 && <div className="badge badge-success">APY {pool.apy}%</div>}
              </h2>
              <p className="text-sm opacity-80">{pool.description}</p>

              <div className="stats bg-base-300 shadow my-4">
                <div className="stat">
                  <div className="stat-title">当前余额</div>
                  <div className="stat-value text-primary">${pool.balance.toLocaleString()}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">总保险金额</div>
                  <div className="stat-value text-secondary">${pool.totalInsured.toLocaleString()}</div>
                </div>
              </div>

              {pool.level > 0 && (
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary" onClick={() => stakeInPool(pool.level)}>
                    质押
                  </button>
                  <button className="btn btn-outline" onClick={() => withdrawFromPool(pool.level)}>
                    提取
                  </button>
                </div>
              )}

              {pool.level === 0 && (
                <div className="bg-base-300 p-3 rounded-lg mt-4">
                  <p className="text-sm">保险金额在合约平仓后将自动转入Level 1投资池</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-base-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">流动性池管理说明</h2>
        <ul className="list-disc ml-6 space-y-3">
          <li>
            所有的保险费进入<strong>保险赔偿池</strong>
            ，随着永续合约的平仓，如果没有爆仓，那么该合约附带的保险金额进入Level 0 agent投资池
          </li>
          <li>
            Level 0 agent投资池借助AI agent进行投资，投资收益进入Level 1
            agent投资池，如果爆仓，则按照赔偿机制进行赔付，赔付后剩余的余额进入Level 1 agent投资池
          </li>
          <li>
            Level 0的投资池吸纳未平仓保险合约的资金同时进行稳健活期投资，Level
            1的投资池吸纳赔付后的保险资金，同时不再移出资金
          </li>
          <li>
            投资收益平台抽成，剩余的按照在保的金额比例进行分红。随之时间推移，Level
            1的资金体量不断增大，吸引更多保险用户
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PoolPage;
