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
    px-6 py-3 rounded-xl font-semibold text-sm
    transition-all duration-200 cursor-pointer
    relative select-none
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950
      hover:from-sky-400 hover:to-cyan-300
      shadow-sm hover:shadow-md
    `,
    outline: `
      border border-slate-700/80 bg-slate-900/50 text-slate-200
      hover:text-white hover:border-slate-500 hover:bg-slate-800/60
      shadow-sm
    `,
    amber: `
      bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950
      hover:from-amber-400 hover:to-amber-300
      shadow-sm
    `,
    ghost: `
      text-slate-300 hover:text-white
      hover:bg-white/5
    `,
  }

  const motionProps = {
    whileHover: { y: -1 },
    whileTap: { y: 0 },
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
