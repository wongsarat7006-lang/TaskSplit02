import '../styles/globals.css'
import Providers from './providers'
import LayoutWrapper from '../components/common/LayoutWrapper'
import React from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}