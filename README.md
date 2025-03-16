<div align="center">
  <img src="public/logo.svg" alt="Lumen Tales Logo" width="200" height="200" />
  <h1>Lumen Tales</h1>
  <p>A tokenized interactive narrative platform where stories become digital assets.</p>
  <p>
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#technology-stack">Technology Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

## Overview

Lumen Tales is a groundbreaking platform that fuses AI-generated consistent character imagery with branching narratives, underpinned by a token economy. Influence story direction and witness characters visually evolve as narratives unfold.

The platform creates a new paradigm for digital storytelling by combining:
- Interactive narrative experiences with meaningful choices
- Blockchain technology for ownership and value exchange
- AI-generated visuals that maintain character consistency
- Community-driven content creation and curation

## Key Features

### Interactive Storytelling
- **Branching Narratives**: Every choice matters and leads to different story paths
- **Character Development**: Characters evolve based on reader choices
- **Multiple Endings**: Discover various conclusions based on your journey
- **Save Progress**: Return to key decision points and explore alternative paths

### AI-Generated Imagery
- **Consistent Character Visualization**: Characters maintain visual consistency across emotional states and scenes
- **Dynamic Scene Generation**: Environments adapt to narrative context
- **Style Customization**: Authors can define visual styles for their stories
- **Visual Evolution**: Character appearances change based on story progression

### Tokenized Stories
- **Story NFTs**: Own unique story tokens that have real value in our ecosystem
- **Character Collectibles**: Acquire character NFTs with special attributes
- **Value Appreciation**: Popular stories and characters increase in value
- **Secondary Market**: Trade your story and character tokens with other users

### Creator Economy
- **Direct Support**: Support creators by purchasing their stories and premium choices
- **Revenue Sharing**: Authors earn from initial sales and secondary market transactions
- **Collaboration Tools**: Co-create stories with other authors and artists
- **Analytics Dashboard**: Track performance and reader engagement

## Technology Stack

### Frontend
- **Framework**: Next.js 13+
- **UI Library**: React 18+
- **Language**: TypeScript 4.9+
- **Styling**: Tailwind CSS 3+
- **Animations**: Framer Motion 6+

### Backend
- **API Routes**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database**: MongoDB

### Blockchain Integration
- **Network**: Ethereum (with Layer 2 support)
- **Smart Contracts**: Solidity
- **Web3 Interface**: ethers.js
- **Wallet Connection**: Web3Modal

### AI Integration
- **Image Generation**: Various AI image models
- **Text Generation**: LLM integration for assisted storytelling
- **Content Moderation**: AI-powered content filtering

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git
- MongoDB instance (local or cloud)
- Ethereum wallet (MetaMask recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lumen-tales/lumen-tales.git
   cd lumen-tales
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Database
   MONGODB_URI=your-mongodb-uri

   # Blockchain
   NEXT_PUBLIC_INFURA_ID=your-infura-id
   NEXT_PUBLIC_CHAIN_ID=1
   NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address

   # AI Integration
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Reader Experience

1. **Create an Account**: Sign up using email or Google authentication
2. **Browse Stories**: Explore featured and trending interactive narratives
3. **Purchase Tokens**: Buy LUMEN tokens to access premium stories and choices
4. **Read and Interact**: Make choices that affect the story outcome
5. **Collect NFTs**: Acquire story and character NFTs for your collection
6. **Trade Assets**: Exchange your NFTs on the marketplace

### Author Experience

1. **Create Author Profile**: Set up your creator account
2. **Story Builder**: Use our intuitive tools to create branching narratives
3. **Visual Customization**: Define character and scene visual styles
4. **Tokenization**: Set up your story and character NFTs
5. **Publish and Promote**: Release your story to the Lumen Tales community
6. **Analytics**: Track reader engagement and revenue

## Project Structure

```
lumen-tales/
├── public/             # Static assets
│   ├── images/         # Image assets
│   ├── fonts/          # Font files
│   └── logo.svg        # Project logo
├── src/
│   ├── components/     # React components
│   │   ├── common/     # Shared UI components
│   │   ├── layout/     # Layout components
│   │   ├── story/      # Story-related components
│   │   └── web3/       # Blockchain components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Next.js pages
│   │   ├── api/        # API routes
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # User dashboard
│   │   ├── stories/    # Story pages
│   │   └── marketplace/# NFT marketplace
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
│       ├── api.ts      # API utilities
│       ├── auth.ts     # Authentication utilities
│       ├── blockchain/ # Blockchain utilities
│       └── format.ts   # Formatting utilities
├── .env.local          # Environment variables (create this file)
├── .gitignore          # Git ignore file
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Roadmap

### Q2 2023
- [x] Platform concept and design
- [x] Technology stack selection
- [x] Initial prototype development

### Q3 2023
- [x] Core functionality implementation
- [x] User authentication system
- [x] Basic story creation tools

### Q4 2023
- [x] Blockchain integration
- [x] NFT smart contracts
- [x] Marketplace foundation

### Q1 2024
- [ ] AI image generation integration
- [ ] Enhanced story creation tools
- [ ] Beta testing program

### Q2 2024
- [ ] Public launch
- [ ] Mobile application
- [ ] Creator partnerships

### Future Plans
- [ ] Advanced AI storytelling assistance
- [ ] Cross-platform expansion
- [ ] Virtual reality experiences
- [ ] Community governance system

## Contributing

We welcome contributions to Lumen Tales! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for React
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [MongoDB](https://www.mongodb.com/) - The developer data platform
- [Ethereum](https://ethereum.org/) - A decentralized platform for applications 