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
    px-6 py-3 rounded-lg font-semibold text-sm
    transition-all duration-300 cursor-pointer
    relative overflow-hidden
  `

  const variants = {
    primary: `
      bg-cyan-neon text-navy-950
      hover:shadow-cyan-glow hover:scale-105
      active:scale-95
    `,
    outline: `
      border border-cyan-neon text-cyan-neon
      hover:bg-cyan-neon/10 hover:shadow-cyan-glow-sm
      active:scale-95
    `,
    amber: `
      bg-amber-glow text-navy-950
      hover:shadow-amber-glow hover:scale-105
      active:scale-95
    `,
    ghost: `
      text-white hover:text-cyan-neon
      hover:bg-white/5
      active:scale-95
    `,
  }

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

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
