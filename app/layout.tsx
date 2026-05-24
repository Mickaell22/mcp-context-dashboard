import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/sidebar'

export const metadata: Metadata = {
  title: 'MCP Context Server',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app">
          <Sidebar />
          <main className="content">
            <div className="content-inner">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
