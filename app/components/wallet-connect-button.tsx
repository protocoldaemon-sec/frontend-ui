"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { EncryptButton } from "./encrypt-button"

export function WalletConnectButton() {
  const { publicKey, connecting, disconnect } = useWallet()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isConnected = !!publicKey

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      // Redirect to daemonx after successful connection
      router.push('/daemonx')
    }
  }, [isConnected, router])

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setShowDropdown(false)
      router.push('/')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden wallet connect button that we'll trigger programmatically */}
      <div className="absolute opacity-0 w-0 h-0 overflow-hidden">
        <WalletMultiButton />
      </div>
      
      <div className="relative">
        {isConnected ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="font-semibold px-5 py-2 rounded-lg bg-cyan-400 text-black hover:bg-cyan-500 transition-colors flex items-center gap-2"
            >
              {`${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`}
              <Lock className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <div 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </div>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 break-all">
                  {publicKey?.toBase58()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EncryptButton
            text={connecting ? 'Connecting...' : 'Connect Wallet'}
            className="font-semibold px-5 py-2 rounded-lg bg-cyan-400 text-black hover:bg-cyan-500 transition-colors"
            onClick={() => {
              const button = document.querySelector('.wallet-adapter-button-trigger') as HTMLButtonElement;
              button?.click();
            }}
          >
            <Lock className="w-4 h-4" />
          </EncryptButton>
        )}
      </div>
      
      {connecting && (
        <div className="absolute -bottom-8 left-0 right-0 text-xs text-center text-cyan-400">
          Waiting for wallet...
        </div>
      )}
    </div>
  )
}
