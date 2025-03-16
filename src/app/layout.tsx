import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  title: 'Lumen Tales | Interactive Narrative Platform',
  description: 'A tokenized interactive narrative platform with AI-generated consistent character imagery and branching narratives.',
  keywords: ['interactive fiction', 'narrative', 'blockchain', 'AI', 'storytelling', 'NFT'],
  authors: [{ name: 'Lumen Tales Team' }],
  creator: 'Lumen Tales',
  publisher: 'Lumen Tales',
  openGraph: {
    title: 'Lumen Tales | Interactive Narrative Platform',
    description: 'A tokenized interactive narrative platform with AI-generated consistent character imagery and branching narratives.',
    url: 'https://www.lumentales.com',
    siteName: 'Lumen Tales',
    images: [
      {
        url: 'https://www.lumentales.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lumen Tales',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumen Tales | Interactive Narrative Platform',
    description: 'A tokenized interactive narrative platform with AI-generated consistent character imagery and branching narratives.',
    creator: '@LumenTales',
    images: ['https://www.lumentales.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-primary-dark to-secondary-dark text-white">
        {children}
      </body>
    </html>
  )
} 