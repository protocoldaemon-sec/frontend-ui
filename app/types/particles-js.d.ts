declare namespace particlesJS {
  interface IParticlesJS {
    (tagId: string, params: unknown): void;
  }
}

declare const particlesJS: particlesJS.IParticlesJS;

export = particlesJS;
export as namespace particlesJS;
