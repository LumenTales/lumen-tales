import React from 'react'

interface Step {
  id: number
  title: string
  description: string
  icon: string
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Choose a Story',
    description: 'Browse our collection of interactive narratives across various genres and themes.',
    icon: '📚',
  },
  {
    id: 2,
    title: 'Make Decisions',
    description: 'Shape the narrative through your choices, affecting character development and plot direction.',
    icon: '🔀',
  },
  {
    id: 3,
    title: 'Earn Tokens',
    description: 'Receive LUMEN tokens for participation, completion, and discovering unique story paths.',
    icon: '✦',
  },
  {
    id: 4,
    title: 'Collect & Trade',
    description: 'Own character NFTs and story tokens that can be traded in our marketplace.',
    icon: '💎',
  },
]

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-primary-dark py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Lumen Tales combines interactive storytelling with blockchain technology to create a unique narrative
            experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.id} className="card flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl">
                {step.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-white/5 p-8 backdrop-blur-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold">For Readers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Experience stories where your choices truly matter</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>See characters evolve visually based on your decisions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Earn tokens for active participation and exploration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Build a collection of character NFTs and story tokens</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold">For Creators</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Create interactive stories with powerful, easy-to-use tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Generate consistent character imagery with our AI technology</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Earn direct revenue through token sales and reader engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary-light">✓</span>
                  <span>Build a loyal audience with ownership incentives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks 