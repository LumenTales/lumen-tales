# Lumen Tales

A tokenized interactive narrative platform where stories become digital assets.

## Overview

Lumen Tales is a groundbreaking platform that fuses AI-generated consistent character imagery with branching narratives, underpinned by a token economy. Influence story direction and witness characters visually evolve as narratives unfold.

## Features

- **Interactive Storytelling**: Immerse yourself in branching narratives where your choices shape the story.
- **AI-Generated Imagery**: Experience consistent character visualization across emotional states and scenes.
- **Tokenized Stories**: Acquire unique story tokens and character NFTs that have real value in our ecosystem.
- **Creator Economy**: Support creators directly by purchasing their stories and premium choices.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js
- **Blockchain Integration**: Ethereum, Web3.js
- **AI Integration**: Various AI image generation and text models

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lumen-tales.git
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

## Project Structure

```
lumen-tales/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Next.js pages
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .env.local          # Environment variables (create this file)
├── .gitignore          # Git ignore file
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/) 