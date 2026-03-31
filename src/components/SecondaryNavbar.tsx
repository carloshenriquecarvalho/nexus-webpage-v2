"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function SecondaryNavbar() {
  return (
    <nav className="fixed top-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="liquid-glass px-6 py-4 rounded-2xl pointer-events-auto flex items-center justify-between w-full max-w-7xl mx-auto shadow-2xl"
      >
        <Link href="/" className="font-bold text-xl tracking-tight text-white hover:text-[var(--accent)] transition-colors">
          Nexus
        </Link>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-zinc-400">
          <Link href="/about-us" className="hover:text-white transition-colors">Quem Somos</Link>
          <Link href="/method" className="hover:text-white transition-colors">Método Nexus</Link>
          <Link href="/#diagnostic" className="hover:text-white transition-colors">Diagnóstico</Link>
        </div>
      </motion.div>
    </nav>
  )
}
