"use client"

export default function LoadingScreen() {
  return (
    <div 
      id="loader" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0053B4] to-[#000B19] transition-opacity duration-1000"
      style={{
        background: 'linear-gradient(154deg, #0053B4 -15.14%, #000B19 83.42%)',
      }}
    >
      <div className="relative z-10">
        <h1 
          id="loader-text" 
          className="font-sans text-3xl font-semibold tracking-widest text-white uppercase md:text-4xl"
        >
          Loading...
        </h1>
      </div>
      
      {/* Particle effect will be added via JavaScript */}
      <div id="particles-js" className="absolute inset-0"></div>
    </div>
  )
}
