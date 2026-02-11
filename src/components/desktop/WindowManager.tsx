'use client'

import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import { WindowState } from './types'
import * as Sentry from '@sentry/nextjs'

interface WindowManagerContextType {
  windows: WindowState[]
  openWindow: (window: Omit<WindowState, 'zIndex' | 'isFocused'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  topZIndex: number
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null)

export function useWindowManager() {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider')
  }
  return context
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [topZIndex, setTopZIndex] = useState(100)

  const openWindow = useCallback((window: Omit<WindowState, 'zIndex' | 'isFocused'>) => {
    Sentry.logger.info('Opening window', {
      windowId: window.id,
      windowTitle: window.title
    })
    Sentry.metrics.count('window.open', 1, {
      attributes: { window_type: window.id }
    })

    setTopZIndex(currentZ => {
      const newZ = currentZ + 1
      setWindows(prev => {
        const existing = prev.find(w => w.id === window.id)
        if (existing) {
          if (existing.isMinimized) {
            Sentry.logger.info('Restoring minimized window', { windowId: window.id })
            return prev.map(w =>
              w.id === window.id
                ? { ...w, isMinimized: false, isFocused: true, zIndex: newZ }
                : { ...w, isFocused: false }
            )
          }
          Sentry.logger.info('Focusing existing window', { windowId: window.id })
          return prev.map(w =>
            w.id === window.id
              ? { ...w, isFocused: true, zIndex: newZ }
              : { ...w, isFocused: false }
          )
        }
        Sentry.metrics.gauge('window.count', prev.length + 1)
        return [
          ...prev.map(w => ({ ...w, isFocused: false })),
          { ...window, zIndex: newZ, isFocused: true }
        ]
      })
      return newZ
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    Sentry.logger.info('Closing window', { windowId: id })
    Sentry.metrics.count('window.close', 1, {
      attributes: { window_type: id }
    })
    setWindows(prev => {
      const newWindows = prev.filter(w => w.id !== id)
      Sentry.metrics.gauge('window.count', newWindows.length)
      return newWindows
    })
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    Sentry.logger.info('Minimizing window', { windowId: id })
    Sentry.metrics.count('window.minimize', 1, {
      attributes: { window_type: id }
    })
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === id)
      const newMaximized = !window?.isMaximized
      Sentry.logger.info(newMaximized ? 'Maximizing window' : 'Restoring window size', { windowId: id })
      Sentry.metrics.count('window.maximize', 1, {
        attributes: { window_type: id, action: newMaximized ? 'maximize' : 'restore' }
      })
      return prev.map(w =>
        w.id === id ? { ...w, isMaximized: newMaximized } : w
      )
    })
  }, [])

  const restoreWindow = useCallback((id: string) => {
    Sentry.logger.info('Restoring window from taskbar', { windowId: id })
    Sentry.metrics.count('window.restore', 1, {
      attributes: { window_type: id }
    })
    setTopZIndex(currentZ => {
      const newZ = currentZ + 1
      setWindows(prev => prev.map(w =>
        w.id === id
          ? { ...w, isMinimized: false, isFocused: true, zIndex: newZ }
          : { ...w, isFocused: false }
      ))
      return newZ
    })
  }, [])

  const focusWindow = useCallback((id: string) => {
    Sentry.logger.info('Focusing window', { windowId: id })
    Sentry.metrics.count('window.focus', 1, {
      attributes: { window_type: id }
    })
    setTopZIndex(currentZ => {
      const newZ = currentZ + 1
      setWindows(prev => prev.map(w =>
        w.id === id
          ? { ...w, isFocused: true, zIndex: newZ }
          : { ...w, isFocused: false }
      ))
      return newZ
    })
  }, [])

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    Sentry.metrics.count('window.position.update', 1, {
      attributes: { window_type: id }
    })
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, x, y } : w
    ))
  }, [])

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    Sentry.metrics.count('window.size.update', 1, {
      attributes: { window_type: id }
    })
    Sentry.metrics.distribution('window.size.width', width, { unit: 'none' })
    Sentry.metrics.distribution('window.size.height', height, { unit: 'none' })
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, width, height } : w
    ))
  }, [])

  return (
    <WindowManagerContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      topZIndex
    }}>
      {children}
    </WindowManagerContext.Provider>
  )
}
