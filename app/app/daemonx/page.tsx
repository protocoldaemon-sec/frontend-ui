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
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function CopilotPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activePanel, setActivePanel] = useState("dashboard")
  const [sidebarClosed, setSidebarClosed] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Check wallet connection after loading
      if (!publicKey) {
        setShowWalletModal(true)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [publicKey])

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

  if (!publicKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-bold">Wallet Required</h1>
          <p className="text-gray-300">
            Please connect your wallet to access the DaemonX dashboard.
          </p>
          <div className="flex justify-center">
            <WalletMultiButton className="wallet-adapter-button-trigger" />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Don't have a wallet? Install a Solana wallet like Phantom or Solflare.
          </p>
        </div>
      </div>
    )
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
