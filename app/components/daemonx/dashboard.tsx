"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function Dashboard() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderActivityChart = () => {
      const chartContainer = chartRef.current
      if (!chartContainer || chartContainer.childElementCount > 0) return

      const data = [
        { day: "Mon", value: 30 },
        { day: "Tue", value: 45 },
        { day: "Wed", value: 60 },
        { day: "Thu", value: 25 },
        { day: "Fri", value: 50 },
        { day: "Sat", value: 75 },
        { day: "Sun", value: 40 },
      ]

      const margin = { top: 20, right: 20, bottom: 30, left: 40 }
      const width = chartContainer.clientWidth - margin.left - margin.right
      const height = chartContainer.clientHeight - margin.top - margin.bottom

      const svg = d3
        .select(chartContainer)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${chartContainer.clientWidth} ${chartContainer.clientHeight}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      const x = d3
        .scaleBand()
        .range([0, width])
        .padding(0.4)
        .domain(data.map((d) => d.day))
      const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, (d) => d.value) || 0])

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("fill", "#94A3B8")

      svg.selectAll(".domain").style("stroke", "#475569")
      svg.selectAll(".tick line").style("stroke", "#475569")

      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", "#00C8FF")
        .attr("x", (d) => x(d.day) || 0)
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .transition()
        .duration(800)
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => height - y(d.value))
    }

    renderActivityChart()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back, Investigator. Here's your mission overview.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <h2 className="text-sm font-medium text-slate-400">Contracts Audited</h2>
          <p className="text-3xl font-bold text-white mt-2">1,204</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <h2 className="text-sm font-medium text-slate-400">High-Risk Alerts</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">87</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <h2 className="text-sm font-medium text-slate-400">Transactions Traced</h2>
          <p className="text-3xl font-bold text-white mt-2">5,621</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <h2 className="text-sm font-medium text-slate-400">Active Cases</h2>
          <p className="text-3xl font-bold text-cyan-400 mt-2">16</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Activity</h2>
          <div ref={chartRef} className="w-full h-72"></div>
        </div>

        {/* Recent Audits */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Audits</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200 truncate">0x123...abc</p>
                <p className="text-xs text-slate-400">Ethereum</p>
              </div>
              <span className="text-sm font-semibold text-red-500">High Risk</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200 truncate">0x456...def</p>
                <p className="text-xs text-slate-400">Polygon</p>
              </div>
              <span className="text-sm font-semibold text-yellow-500">Medium Risk</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200 truncate">0x789...ghi</p>
                <p className="text-xs text-slate-400">Solana</p>
              </div>
              <span className="text-sm font-semibold text-green-500">Low Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
