"use client"

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { ArrowRight, ChevronRight, Code, Lock, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const HeroSection = () => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  }

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>Introducing SentrySol v2.0</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Secure Your Smart Contracts
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                Before It's Too Late
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
              variants={itemVariants}
            >
              SentrySol provides advanced security analysis and monitoring for Solana smart contracts, 
              helping developers identify and fix vulnerabilities before they're exploited.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
              variants={itemVariants}
            >
              <Button 
                size="lg" 
                className="group px-8 py-6 text-lg font-semibold"
                onClick={() => window.location.href = '#get-started'}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg font-semibold hover:bg-white/5"
              >
                View Demo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
              variants={itemVariants}
            >
              {[
                {
                  icon: <Shield className="w-6 h-6 text-accent" />,
                  title: 'Smart Contract Auditing',
                  description: 'Comprehensive security analysis for Solana programs'
                },
                {
                  icon: <Code className="w-6 h-6 text-accent" />,
                  title: 'Vulnerability Detection',
                  description: 'Identify critical security issues before deployment'
                },
                {
                  icon: <Lock className="w-6 h-6 text-accent" />,
                  title: 'Real-time Monitoring',
                  description: '24/7 monitoring for suspicious activities'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left"
                  variants={fadeInUp}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          style={{ animation: 'pulse 15s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] translate-x-1/2 translate-y-1/2 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl"
          style={{ animation: 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '2s' }}
        ></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTIxIDIxaDZ2LTZoLTZ6TTIxIDIxaC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
      </div>
    </section>
  )
}
