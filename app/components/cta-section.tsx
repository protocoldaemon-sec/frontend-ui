import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { EncryptButton } from "./encrypt-button"

export function CTASection() {
  return (
    <section
      id="cta"
      className="py-20 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900"
    >
      <div
        className="absolute inset-0 bg-no-repeat bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://api.builder.io/api/v1/image/assets/TEMP/e9f658c779baa8e0ead0ae0726bb8da1b925c4ae?width=4962')",
        }}
      ></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="plus-jakarta text-4xl md:text-6xl font-bold mb-6 text-white">Ready to See Everything?</h2>
        <p className="plus-jakarta text-xl text-white/80 max-w-3xl mx-auto mb-10">
          Stop chasing shadows. Uncover the truth with the most powerful AI investigator toolkit on the market. Start
          your investigation today and bring clarity to the blockchain.
        </p>
        <Link href="#pricing">
          <EncryptButton
            text="Choose Your Plan"
            className="plus-jakarta font-semibold text-lg md:text-xl uppercase tracking-widest text-white bg-white/10 border border-cyan-400/50 rounded-lg px-10 py-4 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all duration-300"
          >
            <ShieldCheck className="w-5 h-5" />
          </EncryptButton>
        </Link>
      </div>
    </section>
  )
}
