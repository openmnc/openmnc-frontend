import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function GlowButton({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-full font-medium text-sm
    transition-all duration-200 cursor-pointer
    relative select-none text-center
  `

  const variants = {
    primary: `
      bg-[#2997ff] hover:bg-[#0071e3] text-white
      shadow-[0_2px_12px_rgba(41,151,255,0.35)]
      border border-[#2997ff]/40
    `,
    outline: `
      bg-white/8 hover:bg-white/12 text-[#f5f5f7] hover:text-white
      border border-white/16 hover:border-white/28
      backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]
    `,
    amber: `
      bg-[#ff9500] hover:bg-[#e08500] text-[#000000] font-semibold
      shadow-[0_2px_12px_rgba(255,149,0,0.3)]
      border border-[#ff9500]/40
    `,
    ghost: `
      text-[#a1a1a6] hover:text-white
      hover:bg-white/6
    `,
  }

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  }

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${className}`

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={classes} {...props}>
          {children}
        </Link>
      </motion.div>
    )
  }

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  )
}
