"use client"

import { useState } from "react"
import { ScanLine } from "lucide-react"

export function SecurityAnalysis() {
  const [isAuditing, setIsAuditing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [contractAddress, setContractAddress] = useState("")
  const [blockchain, setBlockchain] = useState("Ethereum")

  const handleAudit = async () => {
    if (!contractAddress.trim()) return

    setIsAuditing(true)

    // Simulate audit process
    setTimeout(() => {
      setIsAuditing(false)
      setShowResults(true)
    }, 2000)
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
      <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-6">Smart Contract Audit</h1>

      <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label htmlFor="contractAddress" className="block text-sm font-medium text-slate-400 mb-2">
              Contract Address
            </label>
            <input
              type="text"
              id="contractAddress"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500"
              placeholder="0x..."
            />
          </div>
          <div>
            <label htmlFor="blockchain" className="block text-sm font-medium text-slate-400 mb-2">
              Blockchain
            </label>
            <select
              id="blockchain"
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option>Ethereum</option>
              <option>BNB Chain</option>
              <option>Polygon</option>
              <option>Arbitrum</option>
              <option>Solana</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAudit}
          disabled={isAuditing || !contractAddress.trim()}
          className="mt-6 w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
        >
          <ScanLine className={`w-5 h-5 ${isAuditing ? "animate-spin" : ""}`} />
          <span>{isAuditing ? "Auditing..." : "Audit Contract"}</span>
        </button>
      </div>

      {!showResults && (
        <div className="text-center text-slate-400 py-10">
          <p>Enter a contract address to begin your audit.</p>
        </div>
      )}

      {showResults && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Audit Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
              <h3 className="font-semibold text-white">Overall Risk Score</h3>
              <p className="text-4xl font-bold text-red-500 mt-2">85</p>
              <p className="text-sm text-slate-400">High Risk</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
              <h3 className="font-semibold text-white mb-3">Vulnerability Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-400">Critical:</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-400">High:</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Medium:</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">Low:</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Informational:</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
