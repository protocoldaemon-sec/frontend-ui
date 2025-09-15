"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Sidebar } from "@/components/daemonx/sidebar"
import { Dashboard } from "@/components/daemonx/dashboard"
import { SecurityAnalysis } from "@/components/daemonx/security-analysis"
import { FlowChart } from "@/components/daemonx/flow-chart"
import { CopilotChat } from "@/components/daemonx/copilot-chat"
import { Settings } from "@/components/daemonx/settings"
import { LoadingScreen } from "@/components/loading-screen"
import { History } from "@/components/daemonx/history"
import { Button } from "@/components/ui/button"

export default function CopilotPage() {
  const router = useRouter()
  const { publicKey, disconnect } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [activePanel, setActivePanel] = useState("dashboard")
  const [sidebarClosed, setSidebarClosed] = useState(false)
  const isConnected = !!publicKey

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Redirect to home if not connected
  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.push('/')
    }
  }, [isLoading, isConnected, router])

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
      {isLoading ? (
        <LoadingScreen variant="bars" />
      ) : !isConnected ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Wallet Required</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please connect your wallet to access this page.
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Home
            </Button>
          </div>
        </div>
      ) : (
      <div className="w-full flex h-screen">
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
      )}
    </>
  )
}
