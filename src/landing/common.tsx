import { useEffect, useRef, useState, type ReactNode } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  )
}

export function useCountUp(target: number, active: boolean, decimals = 0, duration = 1500) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) {
      setV(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - t0) / duration))
      setV(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return v.toFixed(decimals).replace('.', ',')
}

export function SectionHead({ kicker, title, sub, align = 'center' }: { kicker: string; title: ReactNode; sub?: string; align?: 'center' | 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-xl'}>
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-indigo-300">{kicker}</span>
      <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08] text-balance">{title}</h2>
      {sub && <p className="mt-4 text-slate-400 text-lg leading-relaxed">{sub}</p>}
    </div>
  )
}
