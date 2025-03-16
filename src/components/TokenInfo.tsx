import React from 'react'
import Link from 'next/link'

const TokenInfo: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Token Economy</h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Our token system creates a sustainable ecosystem where stories become digital assets, creators can monetize
            their work directly, and readers can invest in narratives they value.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl">
              ✦
            </div>
            <h3 className="mb-3 text-xl font-bold">LUMEN Token</h3>
            <p className="mb-4 text-white/70">
              The platform's utility token used for governance, transactions, and accessing premium features.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Governance voting rights</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Access to premium story choices</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Reduced marketplace fees</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl">
              📜
            </div>
            <h3 className="mb-3 text-xl font-bold">Story Tokens</h3>
            <p className="mb-4 text-white/70">
              Unique tokens for individual stories, representing ownership and investment in specific narratives.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Limited editions with scarcity value</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Royalties from secondary sales</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Exclusive story expansion access</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl">
              👤
            </div>
            <h3 className="mb-3 text-xl font-bold">Character NFTs</h3>
            <p className="mb-4 text-white/70">
              Ownership rights to specific characters, with visual consistency across different stories and scenarios.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Character appearance customization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Cross-story character usage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-light">•</span>
                <span>Character development influence</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-xl bg-white/5 p-8 backdrop-blur-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold">Marketplace</h3>
              <p className="mb-4 text-white/70">
                Our decentralized marketplace allows users to trade story tokens, character NFTs, and other digital assets
                with minimal fees and maximum security.
              </p>
              <Link href="/marketplace" className="btn-primary">
                Explore Marketplace
              </Link>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold">Token Utility</h3>
              <p className="mb-4 text-white/70">
                LUMEN tokens power the entire ecosystem, from unlocking premium content to governance voting and creator
                rewards.
              </p>
              <Link href="/token" className="btn-secondary">
                Token Economics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenInfo 