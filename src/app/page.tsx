import Link from 'next/link'
import Logo from '@/components/Logo'
import HeroSection from '@/components/HeroSection'
import FeaturedStories from '@/components/FeaturedStories'
import HowItWorks from '@/components/HowItWorks'
import TokenInfo from '@/components/TokenInfo'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-glass sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Logo className="h-10 w-auto" />
          <nav className="hidden space-x-8 md:flex">
            <Link href="/stories" className="text-white/80 transition-colors hover:text-white">
              Stories
            </Link>
            <Link href="/create" className="text-white/80 transition-colors hover:text-white">
              Create
            </Link>
            <Link href="/marketplace" className="text-white/80 transition-colors hover:text-white">
              Marketplace
            </Link>
            <Link href="/about" className="text-white/80 transition-colors hover:text-white">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <FeaturedStories />
      <HowItWorks />
      <TokenInfo />

      <footer className="bg-primary-dark py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <Logo className="h-8 w-auto" />
              <p className="mt-4 text-white/70">
                A tokenized interactive narrative platform with AI-generated consistent character imagery.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/stories" className="text-white/70 transition-colors hover:text-white">
                    Browse Stories
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-white/70 transition-colors hover:text-white">
                    Create Story
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="text-white/70 transition-colors hover:text-white">
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-white/70 transition-colors hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-white/70 transition-colors hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-white/70 transition-colors hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://x.com/LumenTales"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/LumenTales"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-white/50">
            <p>&copy; {new Date().getFullYear()} Lumen Tales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 