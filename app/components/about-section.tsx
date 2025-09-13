"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function AboutSection() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const renderTrace = () => {
      const svg = d3.select(svgRef.current)
      if (!svg.node()) return

      svg.selectAll("*").remove()

      const width = 500
      const height = 400

      // Generate random trace data
      const generateTraceData = (maxDepth = 3, maxChildren = 3, currentDepth = 0) => {
        const root = { name: "Source", children: [] as any[] }
        if (currentDepth >= maxDepth) return root

        const numChildren = Math.floor(Math.random() * maxChildren) + 1
        for (let i = 0; i < numChildren; i++) {
          const child = generateTraceData(maxDepth, maxChildren, currentDepth + 1)
          if (child.children.length > 0 || Math.random() > 0.3) {
            root.children.push(child)
          }
        }
        return root
      }

      const data = generateTraceData(3, 3)

      // Define glow filter
      const defs = svg.append("defs")
      const filter = defs.append("filter").attr("id", "glow")
      filter.append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur")
      const feMerge = filter.append("feMerge")
      feMerge.append("feMergeNode").attr("in", "coloredBlur")
      feMerge.append("feMergeNode").attr("in", "SourceGraphic")

      const g = svg.append("g").attr("transform", "translate(80,0)")

      const tree = d3.cluster().size([height, width - 160])
      const root = d3.hierarchy(data, (d: any) => d.children)
      tree(root)

      // Links
      const link = g
        .selectAll(".link")
        .data(root.descendants().slice(1))
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#00c8ff")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("d", (d: any) => {
          return (
            "M" +
            d.y +
            "," +
            d.x +
            "C" +
            (d.parent.y + 50) +
            "," +
            d.x +
            " " +
            (d.parent.y + 150) +
            "," +
            d.parent.x +
            " " +
            d.parent.y +
            "," +
            d.parent.x
          )
        })

      // Animate links
      const totalLength = link.nodes().map((node: any) => node.getTotalLength())
      link
        .attr("stroke-dasharray", (d: any, i: number) => totalLength[i] + " " + totalLength[i])
        .attr("stroke-dashoffset", (d: any, i: number) => totalLength[i])
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)

      // Nodes
      const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", (d: any) => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", (d: any) => `translate(${d.y}, ${d.x})`)

      node
        .append("circle")
        .attr("r", 0)
        .attr("fill", (d: any) => (d.depth === 0 ? "#fff" : "#00c8ff"))
        .attr("stroke", "#0053B4")
        .attr("stroke-width", 2)
        .style("filter", "url(#glow)")
        .transition()
        .delay(1000)
        .duration(500)
        .attr("r", (d: any) => (d.depth === 0 ? 8 : 5))
    }

    renderTrace()
    const interval = setInterval(renderTrace, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="py-20 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="plus-jakarta font-medium text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter mb-8 text-white">
              FORGED IN THE
              <br />
              DIGITAL TRENCHES
            </h2>
            <p className="plus-jakarta text-lg text-white/80 leading-relaxed">
              Daemon is an integrated, AI-powered platform that provides unprecedented clarity and actionable
              intelligence to combat financial crime and secure the Web3 ecosystem.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-cyan-400/20 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6">
            <svg ref={svgRef} className="w-full h-full min-h-[400px] lg:min-h-[500px]" viewBox="0 0 500 400" />
          </div>
        </div>
      </div>
    </section>
  )
}
