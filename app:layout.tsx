import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SaaS License Auditor',
  description: 'Enterprise SaaS cost optimization platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}