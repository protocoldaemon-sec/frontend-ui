"use client"

import { useState } from "react"
import { EncryptButton } from "./encrypt-button"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Basic",
      monthlyPrice: "$29",
      annualPrice: "$278",
      description: "For individuals and small teams starting out with on-chain investigation.",
      color: "#3b82f6",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      monthlyPrice: "$59",
      annualPrice: "$566",
      description: "For growing businesses and professional investigators requiring advanced tools.",
      color: "#2563eb",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      monthlyPrice: "Let's Talk",
      annualPrice: "Let's Talk",
      description: "For large-scale organizations needing custom solutions and dedicated support.",
      color: "#1e40af",
      buttonText: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 md:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Flexible Pricing for Every Team</h2>
        <p className="text-white/80 text-lg mb-12">Choose the plan that's right for you.</p>

        <div className="flex justify-center mb-12">
          <div className="bg-white/10 rounded-full p-1 flex items-center">
            <button
              className={`px-6 py-2 rounded-full transition-all ${!isAnnual ? "bg-cyan-400 text-blue-900 font-semibold" : "text-white/70"}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full relative transition-all ${isAnnual ? "bg-cyan-400 text-blue-900 font-semibold" : "text-white/70"}`}
              onClick={() => setIsAnnual(true)}
            >
              Annually
              <span className="absolute -top-2 -right-2 bg-cyan-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="squishy-card relative h-96 w-80 flex-shrink-0 overflow-hidden rounded-2xl p-8 transition-transform duration-1000 hover:scale-105"
              style={{ backgroundColor: plan.color }}
            >
              <div className="card-content relative z-10 text-white">
                <span className="mb-3 block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light">
                  {plan.name}
                </span>
                <span className="price block my-2 font-black text-6xl leading-tight transition-transform duration-1000 origin-top-left scale-85 hover:scale-100">
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  {plan.monthlyPrice !== "Let's Talk" && <br />}
                  {plan.monthlyPrice !== "Let's Talk" && (isAnnual ? "Year" : "Month")}
                </span>
                <p className="text-sm leading-relaxed">{plan.description}</p>
              </div>

              <EncryptButton
                text={plan.buttonText}
                className="squishy-btn absolute bottom-4 left-4 right-4 z-20 rounded-lg border-2 border-white bg-white py-2 text-center font-black uppercase backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
                style={{ color: plan.color }}
              />

              {/* Background Animation Elements */}
              <div className="card-bg absolute inset-0 z-0 transition-transform duration-1000 hover:scale-150">
                <div className="card-bg-circle absolute left-1/2 top-[30%] w-52 h-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/20 transition-transform duration-1000 hover:scale-y-50 hover:-translate-y-6" />
                <div className="card-bg-ellipse absolute left-1/2 top-[70%] w-52 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/20 transition-transform duration-1000 hover:scale-y-225 hover:-translate-y-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
