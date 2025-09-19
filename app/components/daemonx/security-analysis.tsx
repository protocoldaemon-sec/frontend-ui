"use client"

import { useState } from "react"
import { ScanLine, Download } from "lucide-react"
import jsPDF from "jspdf"

export function SecurityAnalysis() {
  const [isAuditing, setIsAuditing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")

  // Form fields
  const [projectName, setProjectName] = useState("")
  const [auditor] = useState("Daemon Protocol")
  const [version, setVersion] = useState("1.0")
  const [contractType, setContractType] = useState("")
  const [commitHash, setCommitHash] = useState("")
  const [language, setLanguage] = useState("Solidity")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleAudit = async () => {
    if (!selectedFile || !projectName || !auditor) return

    setIsAuditing(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowResults(true)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsAuditing(false)
    }
  }

  const reportData = {
    audit_id: "unique_identifier",
    metadata: {
      project_name: projectName,
      audit_date: new Date().toISOString().split("T")[0],
      version,
      auditor,
      contract_type: contractType,
      languages: [language],
      commit_hashes: { v1: commitHash },
    },
    summary: {
      total_issues: 0,
      severity_breakdown: { critical: 0, high: 0, medium: 0, low: 0 },
      recommendations: 0,
      notes: 0,
      overall_security_score: "Pending",
      critical_findings: [],
      status_summary: {
        fixed: 0,
        confirmed: 0,
        acknowledged: 0,
        undetermined: 0,
      },
    },
    findings: [],
    recommendations: [],
    notes: [],
    tools_used: [],
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(14)

    doc.text("Smart Contract Audit Report", 20, 20)
    doc.setFontSize(10)
    doc.text(`Project: ${projectName}`, 20, 35)
    doc.text(`Auditor: ${auditor}`, 20, 42)
    doc.text(`Version: ${version}`, 20, 49)
    doc.text(`Language: ${language}`, 20, 56)
    doc.text(`Contract Type: ${contractType}`, 20, 63)
    doc.text(`Commit Hash: ${commitHash || "N/A"}`, 20, 70)
    doc.text(`Audit Date: ${reportData.metadata.audit_date}`, 20, 77)

    doc.setFontSize(12)
    doc.text("Summary", 20, 90)
    doc.setFontSize(10)
    doc.text(
      `Issues: ${reportData.summary.total_issues} | Score: ${reportData.summary.overall_security_score}`,
      20,
      98
    )

    doc.text("Findings:", 20, 115)
    if (reportData.findings.length === 0) {
      doc.text("No findings yet.", 25, 123)
    }

    doc.save(`${projectName || "audit-report"}.pdf`)
  }

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
        <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-6">
          Smart Contract Pre-Audit
        </h1>

        {!showResults ? (
          <div className="space-y-6">
            {/* Form Fields */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Auditor</label>
              <div className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white">
                Daemon Protocol
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="Solidity">Solidity (Ethereum)</option>
                  <option value="Rust">Rust (Solana)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  placeholder="1.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Contract Type</label>
              <input
                type="text"
                value={contractType}
                onChange={e => setContractType(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                placeholder="ERC20, NFT, DeFi protocol..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Commit Hash</label>
              <input
                type="text"
                value={commitHash}
                onChange={e => setCommitHash(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                placeholder="abc123..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Smart Contract File</label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 cursor-pointer bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white hover:bg-slate-800 transition-colors">
                  <span>{fileName || "Choose a file..."}</span>
                  <input
                    type="file"
                    accept=".sol,.rs"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      setFileName("")
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Supported: Solidity (.sol) or Rust (.rs)
              </p>
            </div>

            <button
              onClick={handleAudit}
              disabled={isAuditing || !selectedFile || !projectName || !auditor}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
            >
              <ScanLine className={`w-5 h-5 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "Auditing..." : "Start Audit"}</span>
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Audit Results</h2>
            <pre className="bg-slate-800/50 text-slate-300 p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(reportData, null, 2)}
            </pre>

            <button
              onClick={handleDownloadPDF}
              className="mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        )}
      </div>
    </>
  )
}
