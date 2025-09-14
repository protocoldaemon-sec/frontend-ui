// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    Lucide?: any; // Type for Lucide icons
    particlesJS?: (id: string, config: any) => void; // Type for particles.js
  }
}

export {}; // This file needs to be a module
