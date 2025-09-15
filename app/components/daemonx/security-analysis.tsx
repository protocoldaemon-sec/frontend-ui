"use client"

import { useState } from "react"
import { ScanLine } from "lucide-react"

export function SecurityAnalysis() {
  const [isAuditing, setIsAuditing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [blockchain, setBlockchain] = useState("Ethereum")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleAudit = async () => {
    if (!selectedFile) return

    setIsAuditing(true)

    try {
      // Here you would typically send the file to your backend for analysis
      // For now, we'll just simulate the upload and analysis
      const formData = new FormData()
      formData.append('contract', selectedFile)
      // formData.append('blockchain', blockchain)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowResults(true)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsAuditing(false)
    }
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
      <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-6">Smart Contract Pre-Audit</h1>

      {!showResults ? (
        <div className="text-center text-slate-400 py-10">
          <p>Upload your smart contract file to begin the audit.</p>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Audit Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="grid grid-cols-1 gap-6 items-end">
          <div>
            <label htmlFor="contractFile" className="block text-sm font-medium text-slate-400 mb-2">
              Smart Contract File
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex-1 cursor-pointer bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white hover:bg-slate-800 transition-colors">
                <span>{fileName || 'Choose a file...'}</span>
                <input
                  type="file"
                  id="contractFile"
                  accept=".sol,.vy,.rs"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileName && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    setFileName(""
                  )}}
                  className="text-slate-400 hover:text-white"
                  title="Remove file"
                >
                  ×
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Supported formats: .sol (Solidity)
            </p>
          </div>
        </div>
        <button
          onClick={handleAudit}
          disabled={isAuditing || !selectedFile}
          className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
        >
          <ScanLine className={`w-5 h-5 ${isAuditing ? "animate-spin" : ""}`} />
          <span>{isAuditing ? "Auditing..." : "Start Audit"}</span>
        </button>
      </div>
    </div>
  )
}
