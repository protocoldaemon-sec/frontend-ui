"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/copilot/sidebar"
import { Dashboard } from "@/components/copilot/dashboard"
import { SecurityAnalysis } from "@/components/copilot/security-analysis"
import { FlowChart } from "@/components/copilot/flow-chart"
import { CopilotChat } from "@/components/copilot/copilot-chat"
import { Settings } from "@/components/copilot/settings"
import { LoadingScreen } from "@/components/loading-screen"

export default function CopilotPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activePanel, setActivePanel] = useState("dashboard")
  const [sidebarClosed, setSidebarClosed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const renderContent = () => {
    switch (activePanel) {
      case "dashboard":
        return <Dashboard />
      case "analysis":
        return <SecurityAnalysis />
      case "flow":
        return <FlowChart />
      case "copilot":
        return <CopilotChat />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <>
      {isLoading && <LoadingScreen variant="bars" />}
      <div className={`w-full flex h-screen ${isLoading ? "loading" : ""}`}>
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          closed={sidebarClosed}
          setClosed={setSidebarClosed}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="content-panel active">{renderContent()}</div>
        </main>
      </div>
    </>
  )
}
