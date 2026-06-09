import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variant === 'default' && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      variant === 'success' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      variant === 'warning' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      variant === 'error' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      variant === 'info' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    )}>
      {children}
    </span>
  )
}
