"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaShieldAlt, FaChartLine, FaHandshake, FaRegLightbulb, FaLock, FaExchangeAlt } from 'react-icons/fa';

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      title: "Liquidation Protection",
      description: "Safeguard your positions against market volatility with our insurance mechanism.",
      icon: <FaShieldAlt className="text-4xl text-blue-500" />,
    },
    {
      title: "Yield Generation",
      description: "Earn yields on your insurance deposits through our sophisticated risk management model.",
      icon: <FaChartLine className="text-4xl text-green-500" />,
    },
    {
      title: "Peer-to-Peer Coverage",
      description: "Connect directly with other users to provide or receive coverage for DeFi positions.",
      icon: <FaHandshake className="text-4xl text-purple-500" />,
    },
    {
      title: "Risk Analysis Tools",
      description: "Access advanced analytics to understand and mitigate your exposure in DeFi protocols.",
      icon: <FaRegLightbulb className="text-4xl text-amber-500" />,
    },
    {
      title: "Secure Smart Contracts",
      description: "Built on audited, robust smart contract infrastructure for maximum security.",
      icon: <FaLock className="text-4xl text-red-500" />,
    },
    {
      title: "Cross-Chain Compatibility",
      description: "Protect your assets across multiple blockchains with our interoperable solution.",
      icon: <FaExchangeAlt className="text-4xl text-cyan-500" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 lg:p-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="z-10 max-w-5xl w-full text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
            Liquidation Insurance Protocol
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Protect your DeFi positions against unexpected liquidations with our decentralized insurance protocol.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`relative overflow-hidden rounded-xl p-6 border transition-all duration-300 ${
                hoveredFeature === index
                  ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105"
                  : "border-gray-700"
              }`}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(10px)",
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: hoveredFeature === index ? 1.1 : 1,
                  y: hoveredFeature === index ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                {feature.icon}
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">{feature.title}</h2>
              <p className="text-gray-400">{feature.description}</p>
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: hoveredFeature === index ? "100%" : "0%",
                }}
                transition={{ duration: 0.4 }}
                className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 absolute bottom-0 left-0"
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            Connect Wallet to Get Started
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-0 pointer-events-none w-full h-full overflow-hidden"
      >
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </motion.div>
    </main>
  );
}
