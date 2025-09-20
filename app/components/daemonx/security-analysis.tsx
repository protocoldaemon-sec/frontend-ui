// "use client"

// import { useState } from "react"
// import { ScanLine, Download } from "lucide-react"
// import jsPDF from "jspdf"

// export function SecurityAnalysis() {
//   const [isAuditing, setIsAuditing] = useState(false)
//   const [showResults, setShowResults] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [fileName, setFileName] = useState("")

//   // Form fields
//   const [projectName, setProjectName] = useState("")
//   const [auditor] = useState("Daemon Protocol")
//   const [version, setVersion] = useState("1.0")
//   const [contractType, setContractType] = useState("")
//   const [commitHash, setCommitHash] = useState("")
//   const [language, setLanguage] = useState("Solidity")

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setSelectedFile(file)
//       setFileName(file.name)
//     }
//   }

//   const handleAudit = async () => {
//     if (!selectedFile || !projectName || !auditor) return

//     setIsAuditing(true)

//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000))
//       setShowResults(true)
//     } catch (error) {
//       console.error("Error uploading file:", error)
//     } finally {
//       setIsAuditing(false)
//     }
//   }

//   const reportData = {
//     audit_id: "unique_identifier",
//     metadata: {
//       project_name: projectName,
//       audit_date: new Date().toISOString().split("T")[0],
//       version,
//       auditor,
//       contract_type: contractType,
//       languages: [language],
//       commit_hashes: { v1: commitHash },
//     },
//     summary: {
//       total_issues: 0,
//       severity_breakdown: { critical: 0, high: 0, medium: 0, low: 0 },
//       recommendations: 0,
//       notes: 0,
//       overall_security_score: "Pending",
//       critical_findings: [],
//       status_summary: {
//         fixed: 0,
//         confirmed: 0,
//         acknowledged: 0,
//         undetermined: 0,
//       },
//     },
//     findings: [],
//     recommendations: [],
//     notes: [],
//     tools_used: [],
//   }

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF()
//     doc.setFont("helvetica", "normal")
//     doc.setFontSize(14)

//     doc.text("Smart Contract Audit Report", 20, 20)
//     doc.setFontSize(10)
//     doc.text(`Project: ${projectName}`, 20, 35)
//     doc.text(`Auditor: ${auditor}`, 20, 42)
//     doc.text(`Version: ${version}`, 20, 49)
//     doc.text(`Language: ${language}`, 20, 56)
//     doc.text(`Contract Type: ${contractType}`, 20, 63)
//     doc.text(`Commit Hash: ${commitHash || "N/A"}`, 20, 70)
//     doc.text(`Audit Date: ${reportData.metadata.audit_date}`, 20, 77)

//     doc.setFontSize(12)
//     doc.text("Summary", 20, 90)
//     doc.setFontSize(10)
//     doc.text(
//       `Issues: ${reportData.summary.total_issues} | Score: ${reportData.summary.overall_security_score}`,
//       20,
//       98
//     )

//     doc.text("Findings:", 20, 115)
//     if (reportData.findings.length === 0) {
//       doc.text("No findings yet.", 25, 123)
//     }

//     doc.save(`${projectName || "audit-report"}.pdf`)
//   }

//   return (
//     <>
//       <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
//         <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-6">
//           Smart Contract Pre-Audit
//         </h1>

//         {!showResults ? (
//           <div className="space-y-6">
//             {/* Form Fields */}
//             <div>
//               <label className="block text-sm text-slate-400 mb-1">Project Name</label>
//               <input
//                 type="text"
//                 value={projectName}
//                 onChange={e => setProjectName(e.target.value)}
//                 className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
//                 placeholder="Enter project name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-slate-400 mb-1">Auditor</label>
//               <div className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white">
//                 Daemon Protocol
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm text-slate-400 mb-1">Language</label>
//                 <select
//                   value={language}
//                   onChange={e => setLanguage(e.target.value)}
//                   className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
//                 >
//                   <option value="Solidity">Solidity (Ethereum)</option>
//                   <option value="Rust">Rust (Solana)</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm text-slate-400 mb-1">Version</label>
//                 <input
//                   type="text"
//                   value={version}
//                   onChange={e => setVersion(e.target.value)}
//                   className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
//                   placeholder="1.0"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm text-slate-400 mb-1">Contract Type</label>
//               <input
//                 type="text"
//                 value={contractType}
//                 onChange={e => setContractType(e.target.value)}
//                 className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
//                 placeholder="ERC20, NFT, DeFi protocol..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-slate-400 mb-1">Commit Hash</label>
//               <input
//                 type="text"
//                 value={commitHash}
//                 onChange={e => setCommitHash(e.target.value)}
//                 className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
//                 placeholder="abc123..."
//               />
//             </div>

//             {/* File Upload */}
//             <div>
//               <label className="block text-sm text-slate-400 mb-2">Smart Contract File</label>
//               <div className="flex items-center space-x-2">
//                 <label className="flex-1 cursor-pointer bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white hover:bg-slate-800 transition-colors">
//                   <span>{fileName || "Choose a file..."}</span>
//                   <input
//                     type="file"
//                     accept=".sol,.rs"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>
//                 {fileName && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedFile(null)
//                       setFileName("")
//                     }}
//                     className="text-slate-400 hover:text-white"
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>
//               <p className="mt-1 text-xs text-slate-500">
//                 Supported: Solidity (.sol) or Rust (.rs)
//               </p>
//             </div>

//             <button
//               onClick={handleAudit}
//               disabled={isAuditing || !selectedFile || !projectName || !auditor}
//               className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
//             >
//               <ScanLine className={`w-5 h-5 ${isAuditing ? "animate-spin" : ""}`} />
//               <span>{isAuditing ? "Auditing..." : "Start Audit"}</span>
//             </button>
//           </div>
//         ) : (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-white mb-4">Audit Results</h2>
//             <pre className="bg-slate-800/50 text-slate-300 p-4 rounded-md text-sm overflow-x-auto">
//               {JSON.stringify(reportData, null, 2)}
//             </pre>

//             <button
//               onClick={handleDownloadPDF}
//               className="mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
//             >
//               <Download className="w-5 h-5" />
//               Download PDF
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

"use client"

import React, { useState } from "react"
import { ScanLine, Download, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import jsPDF from "jspdf"

interface Finding {
  id: string
  severity: string
  title: string
  category: string
  status: string
  description: string
  impact: string
  suggestion: string
  code_location: string
  introduced_version?: string
  fixed_version?: string | null
  cwe_id?: string
  owasp_category?: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  status: string
  priority: string
}

interface Note {
  id: string
  title: string
  description: string
  risk_level: string
}

interface ToolUsed {
  tool_name: string
  version: string
  success: boolean
  findings_count: number
  return_code: number
}

interface AuditResults {
  audit_id: string
  metadata: {
    project_name: string
    audit_date: string
    version: string
    auditor: string
    contract_type: string
    languages: string[]
    audit_approach?: string
    total_contracts_analyzed?: number
    commit_hashes: { [key: string]: string }
  }
  summary: {
    total_issues: number
    severity_breakdown: {
      critical: number
      high: number
      medium: number
      low: number
      informational?: number
    }
    recommendations: number
    notes: number
    overall_security_score: string
    critical_findings: string[]
    status_summary: {
      fixed: number
      confirmed: number
      acknowledged: number
      undetermined: number
    }
  }
  findings: Finding[]
  recommendations: Recommendation[]
  notes: Note[]
  tools_used: ToolUsed[]
}

export function SecurityAnalysis() {
  const [isAuditing, setIsAuditing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const startBatchAnalysis = async () => {
    if (!selectedFile) return null

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('tools', 'slither')
    formData.append('tools', 'mythril')
    formData.append('tools', 'solhint')

    try {
      const response = await fetch('http://intel.daemonprotocol.com/batch-analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in batch analysis:', error)
      throw error
    }
  }

  interface ApiToolResult {
    success?: boolean;
    stderr?: string;
    stdout?: string;
    severity?: string;
    impact?: string;
    suggestion?: string;
    return_code?: number;
  }

  interface ApiResults {
    results?: Record<string, ApiToolResult>;
  }

  const transformApiResultsToAuditFormat = (apiResults: ApiResults): AuditResults => {
    const findings: Finding[] = []
    const tools_used: ToolUsed[] = []
    let total_issues = 0
    const severity_breakdown = { critical: 0, high: 0, medium: 0, low: 0, informational: 0 }

    // Process results from each tool
    if (apiResults.results) {
      Object.entries(apiResults.results).forEach(([toolName, result]: [string, ApiToolResult]) => {
        // Add tool info
        tools_used.push({
          tool_name: toolName,
          version: "latest",
          success: result.success || false,
          findings_count: result.success ? 0 : 1,
          return_code: result.return_code || 0
        })

        // If there are issues (not successful), create findings
        if (!result.success && (result.stderr || result.stdout)) {
          const severity = result.severity || 'medium'
          const finding: Finding = {
            id: `${toolName.toUpperCase()}_001`,
            severity: severity.charAt(0).toUpperCase() + severity.slice(1),
            title: `${toolName.charAt(0).toUpperCase() + toolName.slice(1)} Analysis Issue`,
            category: "Security Analysis",
            status: "Open",
            description: result.stderr || result.stdout || "Analysis completed with issues",
            impact: result.impact || "Requires review",
            suggestion: result.suggestion || "Review the analysis output and address any issues found",
            code_location: fileName || "contract.sol",
            cwe_id: "CWE-0",
            owasp_category: "A03:2021 - Injection"
          }
          
          findings.push(finding)
          total_issues++
          
          // Count severity
          const severityKey = severity.toLowerCase() as keyof typeof severity_breakdown
          if (severityKey in severity_breakdown) {
            severity_breakdown[severityKey]++
          }
        }
      })
    }

    // Calculate overall security score
    let overall_security_score = "A+"
    if (severity_breakdown.critical > 0) {
      overall_security_score = "D"
    } else if (severity_breakdown.high > 0) {
      overall_security_score = "C"
    } else if (severity_breakdown.medium > 0) {
      overall_security_score = "B"
    } else if (severity_breakdown.low > 0) {
      overall_security_score = "A-"
    }

    return {
      audit_id: `AUDIT_${Date.now()}`,
      metadata: {
        project_name: projectName,
        audit_date: new Date().toISOString().split("T")[0],
        version,
        auditor,
        contract_type: contractType,
        languages: [language],
        audit_approach: "Automated static analysis",
        total_contracts_analyzed: 1,
        commit_hashes: { v1: commitHash || fileName }
      },
      summary: {
        total_issues,
        severity_breakdown,
        recommendations: 0,
        notes: 0,
        overall_security_score,
        critical_findings: findings.filter(f => f.severity.toLowerCase() === 'critical').map(f => f.title),
        status_summary: {
          fixed: 0,
          confirmed: 0,
          acknowledged: total_issues,
          undetermined: 0
        }
      },
      findings,
      recommendations: [],
      notes: [],
      tools_used
    }
  }

  const handleAudit = async () => {
    if (!selectedFile || !projectName || !auditor) return

    setIsAuditing(true)
    setError(null)

    try {
      // Start the batch analysis
      const apiResults = await startBatchAnalysis()
      
      if (apiResults) {
        // Transform API results to audit format
        const transformedResults = transformApiResultsToAuditFormat(apiResults)
        setAuditResults(transformedResults)
        setShowResults(true)
      }
    } catch (error) {
      console.error("Error during audit:", error)
      setError("Failed to complete audit. Please try again.")
    } finally {
      setIsAuditing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <XCircle className="w-4 h-4" />
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const handleDownloadPDF = () => {
    if (!auditResults) return

    const doc = new jsPDF()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(16)

    // Title
    doc.text("Smart Contract Security Audit Report", 20, 20)
    
    // Metadata
    doc.setFontSize(12)
    doc.text("Project Information", 20, 35)
    doc.setFontSize(10)
    doc.text(`Project: ${auditResults.metadata.project_name}`, 25, 45)
    doc.text(`Auditor: ${auditResults.metadata.auditor}`, 25, 52)
    doc.text(`Version: ${auditResults.metadata.version}`, 25, 59)
    doc.text(`Language: ${auditResults.metadata.languages.join(", ")}`, 25, 66)
    doc.text(`Contract Type: ${auditResults.metadata.contract_type}`, 25, 73)
    doc.text(`Audit Date: ${auditResults.metadata.audit_date}`, 25, 80)

    // Summary
    doc.setFontSize(12)
    doc.text("Security Summary", 20, 95)
    doc.setFontSize(10)
    doc.text(`Overall Score: ${auditResults.summary.overall_security_score}`, 25, 105)
    doc.text(`Total Issues: ${auditResults.summary.total_issues}`, 25, 112)
    doc.text(`Critical: ${auditResults.summary.severity_breakdown.critical}`, 25, 119)
    doc.text(`High: ${auditResults.summary.severity_breakdown.high}`, 25, 126)
    doc.text(`Medium: ${auditResults.summary.severity_breakdown.medium}`, 25, 133)
    doc.text(`Low: ${auditResults.summary.severity_breakdown.low}`, 25, 140)

    // Findings
    if (auditResults.findings.length > 0) {
      doc.setFontSize(12)
      doc.text("Findings", 20, 155)
      
      auditResults.findings.forEach((finding: Finding, index: number) => {
        const yPos = 165 + (index * 20)
        if (yPos > 280) {
          doc.addPage()
        }
        
        doc.setFontSize(10)
        doc.text(`${index + 1}. ${finding.title} [${finding.severity}]`, 25, yPos)
        doc.text(`   ${finding.description.substring(0, 100)}...`, 25, yPos + 7)
      })
    }

    doc.save(`${auditResults.metadata.project_name || "audit-report"}.pdf`)
  }

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
        <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-6">
          Smart Contract Security Audit
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200">
            {error}
          </div>
        )}

        {!showResults ? (
          <div className="space-y-6">
            {/* Form Fields - Same as before */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVersion(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContractType(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                placeholder="ERC20, NFT, DeFi protocol..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Commit Hash</label>
              <input
                type="text"
                value={commitHash}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommitHash(e.target.value)}
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
              <span>{isAuditing ? "Analyzing..." : "Start Security Audit"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Audit Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Audit Results</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResults(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white rounded-md px-4 py-2 transition-colors"
                >
                  New Audit
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md px-4 py-2 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {auditResults && (
              <>
                {/* Security Score */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Security Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {auditResults.summary.overall_security_score}
                      </div>
                      <div className="text-sm text-slate-400">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {auditResults.summary.total_issues}
                      </div>
                      <div className="text-sm text-slate-400">Total Issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {auditResults.tools_used.length}
                      </div>
                      <div className="text-sm text-slate-400">Tools Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {auditResults.summary.status_summary.acknowledged}
                      </div>
                      <div className="text-sm text-slate-400">Acknowledged</div>
                    </div>
                  </div>
                </div>

                {/* Severity Breakdown */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Severity Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(auditResults.summary.severity_breakdown).map(([severity, count]) => (
                      <div key={severity} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className={getSeverityColor(severity)}>
                            {getSeverityIcon(severity)}
                          </span>
                          <span className="text-white capitalize">{severity}</span>
                        </div>
                        <span className="font-bold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Findings */}
                {auditResults.findings.length > 0 && (
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Findings</h3>
                    <div className="space-y-4">
                      {auditResults.findings.map((finding, index) => (
                        <div key={finding.id} className="border border-slate-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={getSeverityColor(finding.severity)}>
                                {getSeverityIcon(finding.severity)}
                              </span>
                              <h4 className="font-semibold text-white">{finding.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)} bg-opacity-20`}>
                                {finding.severity}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{finding.description}</p>
                          <div className="text-xs text-slate-400">
                            <span>Category: {finding.category}</span>
                            {finding.code_location && (
                              <span className="ml-4">Location: {finding.code_location}</span>
                            )}
                          </div>
                          {finding.suggestion && (
                            <div className="mt-2 p-2 bg-blue-900/30 rounded text-sm text-blue-200">
                              <strong>Recommendation:</strong> {finding.suggestion}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools Used */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Analysis Tools</h3>
                  <div className="grid gap-3">
                    {auditResults.tools_used.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-white capitalize">{tool.tool_name}</span>
                          <span className="text-sm text-slate-400">v{tool.version}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${tool.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {tool.success ? 'Success' : 'Issues Found'}
                          </span>
                          <span className="text-sm text-slate-400">{tool.findings_count} findings</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw JSON (for debugging) */}
                <details className="bg-slate-800/50 rounded-lg p-6">
                  <summary className="text-lg font-semibold text-white cursor-pointer">
                    Raw Audit Data (for debugging)
                  </summary>
                  <pre className="mt-4 bg-slate-900 text-slate-300 p-4 rounded-md text-sm overflow-x-auto max-h-96 overflow-y-auto">
                    {JSON.stringify(auditResults, null, 2)}
                  </pre>
                </details>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}