'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface ConfirmOptions {
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export interface ConfirmContextType {
  confirm: (opts: ConfirmOptions | string) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [opts, setOpts] = useState<ConfirmOptions>({ message: '' })
  const [resolveRef, setResolveRef] = useState<((v: boolean) => void) | null>(null)

  const confirm = useCallback((o: ConfirmOptions | string) => {
    const options = typeof o === 'string' ? { message: o } : o
    setOpts(options)
    setOpen(true)
    return new Promise<boolean>(res => {
      setResolveRef(() => res)
    })
  }, [])

  const handleConfirm = () => {
    resolveRef?.(true)
    resolveRef && setResolveRef(null)
    setOpen(false)
  }

  const handleCancel = () => {
    resolveRef?.(false)
    resolveRef && setResolveRef(null)
    setOpen(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div
          onClick={handleCancel}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0f0f0f',
              borderRadius: 16,
              padding: 24,
              maxWidth: 380,
              width: '100%',
              border: '1px solid rgba(255,107,0,0.25)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            }}
          >
            <p style={{ margin: '0 0 20px', fontSize: 15, color: '#f0ede8', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {opts.message}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {opts.cancelText ?? 'ยกเลิก'}
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: opts.danger ? '#ef4444' : '#ff6b00',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {opts.confirmText ?? 'ตกลง'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    return {
      confirm: (o: ConfirmOptions | string) =>
        Promise.resolve(window.confirm(typeof o === 'string' ? o : o.message)),
    }
  }
  return ctx
}
