"use client"

import { useState, useRef } from "react"
import { Search, Download } from "lucide-react"
import * as d3 from "d3"

export function FlowChart() {
  const [isTracing, setIsTracing] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [blockchain, setBlockchain] = useState("Solana")
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTrace = async () => {
    if (!txHash.trim()) return

    setIsTracing(true)

    setTimeout(() => {
      setIsTracing(false)
      setShowChart(true)
      renderFlowChart()
    }, 1000)
  }

  const renderFlowChart = () => {
    const data = {
      name: "67WvS...",
      children: [
        {
          name: "Inflow (D5kPA...)",
          children: [{ name: "Lazarus Group (Nbtpr...)" }],
        },
        {
          name: "Outflow (DxY1P...)",
          children: [
            { name: "Lazarus Group (4iqPx...)" },
            {
              name: "Mixer (CEX)",
              children: [{ name: "EFmqz..." }, { name: "DYU4y..." }],
            },
          ],
        },
      ],
    }

    const container = containerRef.current
    const svgElement = svgRef.current
    if (!container || !svgElement) return

    const svg = d3.select(svgElement)
    svg.selectAll("*").remove()

    const width = container.clientWidth
    const height = container.clientHeight

    svg.attr("viewBox", [-width / 2, -height / 2, width, height])

    const root = d3.hierarchy(data)
    const treeLayout = d3.cluster().size([height, width - 260])
    treeLayout(root)

    const g = svg.append("g").attr("transform", "translate(100,0)")

    // Links
    const link = g
      .selectAll(".link")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#475569")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        (d: any) =>
          `M${d.y},${d.x}C${d.parent.y + 50},${d.x} ${d.parent.y + 150},${d.parent.x} ${d.parent.y},${d.parent.x}`,
      )

    // Nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", (d: any) => {
        let classes = "node "
        if (d.data.name.startsWith("Inflow")) classes += "node--inflow"
        else if (d.data.name.startsWith("Outflow")) classes += "node--outflow"
        else classes += "node--root"
        return classes
      })
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)

    node
      .append("circle")
      .attr("r", 6)
      .attr("fill", (d: any) => {
        if (d.data.name.startsWith("Inflow")) return "#0053B4"
        if (d.data.name.startsWith("Outflow")) return "#7C3AED"
        return "#10B981"
      })
      .attr("stroke", "#00C8FF")
      .attr("stroke-width", 1.5)

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => (d.children ? -12 : 12))
      .attr("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .attr("fill", "#E2E8F0")
      .attr("font-family", "Poppins, sans-serif")
      .attr("font-size", "10px")
      .text((d: any) => d.data.name)

    // Add zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })
    svg.call(zoom as any)
  }

  const downloadChart = () => {
    // Implementation for downloading chart as PNG
    console.log("Download chart functionality")
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
      <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-2">Transaction Flow</h1>
      <p className="text-slate-300 mb-6 max-w-2xl">
        Enter a transaction hash to visualize the inflow and outflow of funds.
      </p>

      <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label htmlFor="txHash" className="block text-sm font-medium text-slate-400 mb-2">
              Transaction Hash
            </label>
            <input
              type="text"
              id="txHash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="67WvS9rGeGmLPkX27GSHcBtnpC52VyjE..."
            />
          </div>
          <div>
            <label htmlFor="flowBlockchain" className="block text-sm font-medium text-slate-400 mb-2">
              Blockchain
            </label>
            <select
              id="flowBlockchain"
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option>Solana</option>
              <option>Ethereum</option>
              <option>BNB Chain</option>
              <option>Polygon</option>
              <option>Arbitrum</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleTrace}
            disabled={isTracing || !txHash.trim()}
            className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-black font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
          >
            <Search className={`w-5 h-5 ${isTracing ? "animate-spin" : ""}`} />
            <span>{isTracing ? "Tracing..." : "Trace Transaction"}</span>
          </button>
          <button
            onClick={downloadChart}
            disabled={!showChart}
            className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-md px-6 py-2 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Chart</span>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[600px] bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {!showChart && (
          <div className="text-center text-slate-400">
            <p>Enter a transaction hash to begin tracing.</p>
          </div>
        )}
        <svg ref={svgRef} className={`w-full h-full ${showChart ? "block" : "hidden"}`} />
      </div>
    </div>
  )
}
