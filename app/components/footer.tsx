import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-16 px-4 md:px-8 border-t border-white/10 bg-[#001021]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1: Logo & Social */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2F964b489dc4f14245af788e19c343d061"
                alt="Daemon Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-white tracking-wider">Daemon</span>
            </div>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a
                href="https://x.com/DaemonProtocol"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="X/Twitter"
              >
                <img src="/x.png" alt="X Logo" className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/protocoldaemon-sec/"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Empty for spacing */}
          <div></div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-2 text-white">Stay Updated</h4>
            <p className="text-white/60 mb-4">Get the latest news and updates from Daemon.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/50"
              />
              <button
                type="submit"
                className="bg-cyan-400 text-black px-4 py-2 rounded-r-md font-semibold hover:bg-cyan-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="text-center text-white/50 mt-12 pt-8 border-t border-white/10">
          <p>&copy; 2025 Daemon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
