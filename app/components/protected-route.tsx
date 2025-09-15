"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { publicKey, connecting } = useWallet()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!connecting && !publicKey && isClient) {
      router.push('/')
    }
  }, [publicKey, connecting, router, isClient])

  if (!isClient || connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Connecting wallet...</p>
        </div>
      </div>
    )
  }

  if (!publicKey) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
