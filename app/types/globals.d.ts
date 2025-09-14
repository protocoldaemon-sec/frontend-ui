import { LucideIcon } from 'lucide-react';

declare global {
  interface Window {
    Lucide: typeof import('lucide-react');
    particlesJS: any; // You might want to add proper types for particles.js later
  }
}

export {};
