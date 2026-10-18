import { createContext, useContext, useState, type ReactNode } from 'react'
import { children, type Child } from '@/data'

const ChildContext = createContext<{ child: Child; setChildId: (id: string) => void } | null>(null)

export function ChildProvider({ children: node }: { children: ReactNode }) {
  const [childId, setChildId] = useState(children[0].id)
  const child = children.find((c) => c.id === childId)!
  return <ChildContext.Provider value={{ child, setChildId }}>{node}</ChildContext.Provider>
}

export function useChild() {
  const ctx = useContext(ChildContext)
  if (!ctx) throw new Error('useChild, ChildProvider içinde kullanılmalı')
  return ctx
}
