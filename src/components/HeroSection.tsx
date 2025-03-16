import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 z-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-glow mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Interactive Stories <br />
              <span className="text-primary-light">Powered by AI</span>
            </h1>
            <p className="mb-8 text-xl text-white/80">
              Experience narratives where your choices matter. Explore AI-generated consistent character imagery with
              branching storylines, all underpinned by a token economy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/stories" className="btn-primary">
                Explore Stories
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[350px] w-[250px] rotate-[-5deg] overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-dark to-secondary"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="mb-4 h-24 w-24 rounded-full bg-white/20"></div>
                  <h3 className="mb-2 text-xl font-bold">The Lost Key</h3>
                  <p className="mb-4 text-sm text-white/80">An adventure of discovery and mystery</p>
                  <div className="mt-auto w-full">
                    <div className="mb-2 h-8 w-full rounded bg-white/10"></div>
                    <div className="h-8 w-full rounded bg-white/10"></div>
                  </div>
                </div>
              </div>
              <div className="relative ml-[-50px] mt-[50px] h-[350px] w-[250px] rotate-[5deg] overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary to-primary-dark"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="mb-4 h-24 w-24 rounded-full bg-white/20"></div>
                  <h3 className="mb-2 text-xl font-bold">Echoes of Time</h3>
                  <p className="mb-4 text-sm text-white/80">A journey through parallel realities</p>
                  <div className="mt-auto w-full">
                    <div className="mb-2 h-8 w-full rounded bg-white/10"></div>
                    <div className="h-8 w-full rounded bg-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 