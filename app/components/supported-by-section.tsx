export function SupportedBySection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-[#000B19]">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="plus-jakarta text-2xl md:text-3xl font-bold text-white/70 uppercase tracking-wider">
            Supported By
          </h2>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
          {/* Logo 1 - Blockchair */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-24 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">Blockchair</span>
            </div>
          </div>

          {/* Logo 2 - BlockSec */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">BlockSec</span>
            </div>
          </div>

          {/* Logo 3 - Cerebras */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-24 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Cerebras</span>
            </div>
          </div>

          {/* Logo 4 - LangChain */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-24 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LangChain</span>
            </div>
          </div>

          {/* Logo 5 - MistralAI */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-24 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MistralAI</span>
            </div>
          </div>

          {/* Logo 6 - ScoreChain */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-24 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ScoreChain</span>
            </div>
          </div>

          {/* Logo 7 - Super Team Indonesia */}
          <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
            <div className="w-24 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Super Team Indonesia</span>
            </div>
          </div>
        </div>

        {/* Optional: Add a subtle divider or additional text */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm plus-jakarta">
            A unified security platform powered by blockchain analytics, AI intelligence, and cutting-edge security solutions
          </p>
        </div>
      </div>
    </section>
  );
}