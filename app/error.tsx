'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div style={{
      padding: '48px',
      fontFamily: 'JetBrains Mono, monospace',
      color: '#ededed',
      background: '#0a0a0a',
      minHeight: '100vh',
    }}>
      <div style={{ marginBottom: '8px', color: '#5a5a5a', fontSize: '11px', letterSpacing: '0.08em' }}>
        RUNTIME ERROR
      </div>
      <pre style={{
        background: '#111',
        border: '1px solid #1f1f1f',
        borderRadius: '6px',
        padding: '16px',
        fontSize: '13px',
        color: '#fda4af',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {error.message}
        {error.stack && '\n\n' + error.stack}
      </pre>
      <button
        onClick={reset}
        style={{
          marginTop: '16px',
          background: 'transparent',
          border: '1px solid #1f1f1f',
          borderRadius: '6px',
          color: '#8a8a8a',
          padding: '6px 16px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '12px',
        }}
      >
        Reintentar
      </button>
    </div>
  )
}
