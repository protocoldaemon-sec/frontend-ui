"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/daemonx/sidebar"
import { Dashboard } from "@/components/daemonx/dashboard"
import { SecurityAnalysis } from "@/components/daemonx/security-analysis"
import { FlowChart } from "@/components/daemonx/flow-chart"
import { CopilotChat } from "@/components/daemonx/copilot-chat"
import { Settings } from "@/components/daemonx/settings"
import { LoadingScreen } from "@/components/loading-screen"
import { History } from "@/components/daemonx/history"

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
      case "history":
        return <History />
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
