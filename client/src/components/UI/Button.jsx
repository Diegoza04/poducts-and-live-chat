import React from 'react'
import clsx from 'classnames'

export default function Button({ children, variant = 'primary', className, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium px-4 py-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary:
      'bg-green-600 hover:bg-green-500 active:bg-blue-700 text-white focus:ring-blue-400',
    ghost:
      'bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white focus:ring-blue-300',
    danger:
      'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white focus:ring-red-400',
  }

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
