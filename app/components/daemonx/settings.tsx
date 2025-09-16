"use client"

import { useState } from "react"

export function Settings() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    product: true,
  })

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 shadow-lg shadow-black/20 backdrop-blur-sm max-w-2xl mx-auto">
      <h1 className="plus-jakarta text-3xl md:text-4xl font-bold text-white mb-6">Settings</h1>
      <div className="space-y-8">
        {/* Theme Preference */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Theme</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={() => setTheme("system")}
                className="accent-cyan-400"
              />
              <span className="text-slate-200">System</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="accent-cyan-400"
              />
              <span className="text-slate-200">Light</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="accent-cyan-400"
              />
              <span className="text-slate-200">Dark</span>
            </label>
          </div>
        </section>

        {/* Notification Preferences */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))}
                className="accent-cyan-400"
              />
              <span className="text-slate-200">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={e => setNotifications(n => ({ ...n, push: e.target.checked }))}
                className="accent-cyan-400"
              />
              <span className="text-slate-200">Push notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications.product}
                onChange={e => setNotifications(n => ({ ...n, product: e.target.checked }))}
                className="accent-cyan-400"
              />
              <span className="text-slate-200">Product updates</span>
            </label>
          </div>
        </section>

        {/* Account Actions */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Account</h2>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
            // onClick={handleLogout}
            disabled
            title="Not implemented"
          >
            Log Out
          </button>
        </section>

        {/* Placeholder for future settings */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">More Settings</h2>
          <p className="text-slate-400">Additional preferences and integrations coming soon.</p>
        </section>
      </div>
    </div>
  )
}
