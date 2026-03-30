import { ReactNode } from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost"
  children: ReactNode
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  if (variant === "primary") {
    return (
      <motion.button 
        className={`px-8 py-5 bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold rounded-2xl hover:brightness-125 transition-all duration-300 shadow-[0_0_30px_-10px_#F22471] hover:shadow-[0_0_40px_0px_#F22471] ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
  
  return (
    <motion.button 
      className={`px-8 py-5 border border-[#F22471]/30 text-white font-medium rounded-2xl hover:bg-[#F22471]/10 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
