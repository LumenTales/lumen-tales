import React from 'react'
import Link from 'next/link'

interface StoryCard {
  id: string
  title: string
  description: string
  author: string
  genre: string
  tokenValue: number
  imageUrl: string
}

const featuredStories: StoryCard[] = [
  {
    id: '1',
    title: 'The Lost Key',
    description: 'An adventure of discovery and mystery in a forgotten city.',
    author: 'Elena Rivers',
    genre: 'Adventure',
    tokenValue: 250,
    imageUrl: '/images/story1.jpg',
  },
  {
    id: '2',
    title: 'Echoes of Time',
    description: 'A journey through parallel realities and fractured timelines.',
    author: 'Marcus Chen',
    genre: 'Sci-Fi',
    tokenValue: 320,
    imageUrl: '/images/story2.jpg',
  },
  {
    id: '3',
    title: 'Whispers in the Dark',
    description: 'Uncover the secrets of an ancient mansion with a troubled past.',
    author: 'Sophia Black',
    genre: 'Mystery',
    tokenValue: 280,
    imageUrl: '/images/story3.jpg',
  },
  {
    id: '4',
    title: 'Heart of the Storm',
    description: 'Navigate a world where emotions manifest as elemental powers.',
    author: 'Liam Wright',
    genre: 'Fantasy',
    tokenValue: 300,
    imageUrl: '/images/story4.jpg',
  },
]

const FeaturedStories: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Stories</h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Explore our curated selection of interactive narratives. Each story offers unique choices, characters, and
            token rewards.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredStories.map((story) => (
            <Link key={story.id} href={`/stories/${story.id}`} className="card group">
              <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${story.imageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-dark px-3 py-1 text-xs font-medium">{story.genre}</span>
                    <span className="flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      <span className="mr-1 text-accent">✦</span>
                      {story.tokenValue}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary-light">{story.title}</h3>
              <p className="mb-3 text-sm text-white/70">{story.description}</p>
              <p className="text-xs text-white/50">By {story.author}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/stories" className="btn-secondary">
            View All Stories
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedStories 