import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amanda Nyong | AI Influencer',
  description: 'Chat with Amanda Nyong - Your favorite AI influencer. Experience meaningful conversations, creative ideas, and genuine connection.',
  keywords: ['AI influencer', 'chat', 'Amanda Nyong', 'artificial intelligence', 'conversation'],
  openGraph: {
    title: 'Amanda Nyong | AI Influencer',
    description: 'Chat with Amanda Nyong - Your favorite AI influencer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amanda Nyong | AI Influencer',
    description: 'Chat with Amanda Nyong - Your favorite AI influencer.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

