"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { LayoutDashboard, ShieldCheck, GitMerge, BarChart3, Bot, Settings, ChevronsRight, History, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activePanel: string
  setActivePanel: (panel: string) => void
  closed: boolean
  setClosed: (closed: boolean) => void
}

export function Sidebar({ activePanel, setActivePanel, closed, setClosed }: SidebarProps) {
  const router = useRouter()
  const { publicKey, disconnect } = useWallet()
  const isConnected = !!publicKey
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, tooltip: "Dashboard" },
    { id: "analysis", icon: ShieldCheck, tooltip: "Security Analysis" },
    { id: "flow", icon: GitMerge, tooltip: "Flow" },
    { id: "portotrack", icon: BarChart3, tooltip: "PortoTrack" },
    { id: "copilot", icon: Bot, tooltip: "Copilot" },
    { id: "history", icon: History, tooltip: "History" },
    { id: "settings", icon: Settings, tooltip: "Settings" },
  ]

  return (
    <nav
      className={`sidebar sticky top-0 h-screen shrink-0 border-r border-slate-700/50 p-2 flex flex-col justify-between bg-slate-900/50 backdrop-blur-md transition-all duration-300 ${
        closed ? "w-18" : "w-64"
      }`}
    >
      <div>
        <div className="border-b border-slate-700/50 pb-3 mb-3">
          <Link href="/" className="flex items-center gap-3 p-2">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0b774bfeabf0a41dd54fc314dba2e3da7216f89b?width=130"
              alt="Daemon Logo"
              className="w-10 h-10 shrink-0"
            />
            <div
              className={`title-text overflow-hidden transition-all duration-200 ${closed ? "opacity-0 w-0" : "opacity-100"}`}
            >
              <span className="block text-sm font-semibold whitespace-nowrap text-white">Daemon</span>
              <span className="block text-xs text-slate-400 whitespace-nowrap">Investigator</span>
            </div>
          </Link>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`nav-item relative flex h-12 w-full items-center rounded-lg transition-colors ${
                  activePanel === item.id ? "bg-cyan-400/10 text-cyan-400" : "text-slate-400 hover:bg-slate-700/50"
                }`}
              >
                <div className="grid h-full w-14 place-content-center text-lg shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-sm font-medium nav-text whitespace-nowrap transition-all duration-200 ${closed ? "opacity-0 w-0" : "opacity-100"}`}
                >
                  {item.tooltip}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        {isConnected && (
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await disconnect()
                router.push('/')
              } catch (error) {
                console.error('Error disconnecting wallet:', error)
              }
            }}
            className={`w-full justify-start text-slate-400 hover:bg-slate-700/50 hover:text-white ${
              closed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!closed && <span className="ml-3">Disconnect Wallet</span>}
          </Button>
        )}
        
        <button 
          onClick={() => setClosed(!closed)} 
          className="w-full flex items-center p-2 text-slate-400 hover:bg-slate-700/50 rounded-md transition-colors"
        >
          <div className="grid size-10 place-content-center">
            <ChevronsRight className={`w-5 h-5 transition-transform ${closed ? "rotate-180" : ""}`} />
          </div>
          {!closed && (
            <span className="ml-3 text-sm font-medium">
              {closed ? '' : 'Collapse'}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
