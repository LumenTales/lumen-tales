# Lumen Tales AI Components

<div align="center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="150" height="150">
    <!-- Background circle with gradient -->
    <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#2A3B8F" />
    <stop offset="100%" stop-color="#2C75D8" />
    </linearGradient>
    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#7BA9FF" />
    <stop offset="100%" stop-color="#4C87E6" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="5" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    </defs>

    <!-- Main circular background -->
    <circle cx="150" cy="150" r="130" fill="url(#bgGradient)" />
    <!-- Outer ring (token/blockchain representation) -->
    <circle cx="150" cy="150" r="130" fill="none" stroke="#5F9AE6" stroke-width="4" stroke-dasharray="8 4" />
    <!-- Light beam emanating from book (lumen means light) -->
    <path d="M150 80 L100 200 L200 200 Z" fill="url(#glowGradient)" opacity="0.7" filter="url(#glow)" />
    <!-- Open book base -->
    <path d="M90 170 C90 155, 150 140, 150 140 C150 140, 210 155, 210 170 L210 190 C210 205, 150 220, 150 220 C150 220, 90 205, 90 190 Z" fill="#E0E5FF" />
    <path d="M150 140 L150 220" stroke="#2A3B8F" stroke-width="3" />
    <!-- Character silhouettes emerging from book (representing interactive narrative) -->
    <path d="M125 160 C125 130, 140 120, 150 130 C160 120, 175 130, 175 160" fill="none" stroke="#2C75D8" stroke-width="3" />
    <circle cx="125" cy="130" r="8" fill="#7BA9FF" />
    <circle cx="175" cy="130" r="8" fill="#7BA9FF" />
    <!-- Branch paths (representing branching narrative) -->
    <path d="M130 100 L115 70" stroke="#5F9AE6" stroke-width="2" />
    <path d="M130 100 L145 70" stroke="#5F9AE6" stroke-width="2" />
    <path d="M170 100 L155 70" stroke="#5F9AE6" stroke-width="2" />
    <path d="M170 100 L185 70" stroke="#5F9AE6" stroke-width="2" />
    <!-- Nodes at end of branches (choices/decision points) -->
    <circle cx="115" cy="70" r="5" fill="#FFD700" />
    <circle cx="145" cy="70" r="5" fill="#FFD700" />
    <circle cx="155" cy="70" r="5" fill="#FFD700" />
    <circle cx="185" cy="70" r="5" fill="#FFD700" />
  </svg>

  <h3>AI-Powered Storytelling Components</h3>
</div>

This directory contains the AI components used in the Lumen Tales platform for generating images, analyzing emotions, and maintaining character consistency. These components form the core of our AI-powered storytelling engine.

## 🧠 AI Architecture Overview

The Lumen Tales AI system is built on a modular architecture that separates concerns while maintaining interoperability between components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React UI Layer │     │   Custom Hooks  │     │  API Endpoints  │
│  (Components)   │────▶│   (useAI etc.)  │────▶│  (/api/ai/*)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                        │
                                ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  AI Engine Core │     │  External AI    │
                        │  Components     │────▶│  Services       │
                        └─────────────────┘     └─────────────────┘
```

## 🧩 Core AI Components

### CharacterConsistencyEngine

The `CharacterConsistencyEngine` ensures that characters maintain visual consistency across different scenes, emotions, and outfits. It provides:

- Character image generation with emotion variations
- Consistency verification between generated images
- Caching of generated images for performance
- Prompt optimization for better image generation

**Key Features:**
- Maintains facial feature consistency across different emotions
- Preserves character attributes like hair color, eye color, and body type
- Optimizes prompts for AI image generation based on character attributes
- Caches generated images to improve performance and reduce API calls

**Technical Implementation:**
- Uses a character-specific cache with timestamp-based eviction
- Generates optimized prompts based on character attributes and desired emotion
- Verifies consistency between generated images using similarity metrics
- Supports multiple outfit and scene contexts for the same character

```typescript
// Example usage
const characterEngine = new CharacterConsistencyEngine();
const characterImage = await characterEngine.generateCharacterImage(
  character,
  'happy',
  'casual',
  'forest'
);
```

### NarrativeImageMatcher

The `NarrativeImageMatcher` converts text descriptions to visual representations, ensuring that generated images match the narrative context. It provides:

- Scene image generation with character integration
- Visual element extraction from text
- Scene description optimization for better image generation
- Caching of generated images for performance

**Key Features:**
- Extracts visual elements from narrative text
- Optimizes scene descriptions for better image generation
- Integrates characters into scene contexts
- Maintains visual consistency with previous scenes

**Technical Implementation:**
- Uses natural language processing to extract visual elements from text
- Prioritizes descriptive elements based on visual importance
- Combines setting, mood, and character information into cohesive prompts
- Caches scene images with content-based hashing for efficient retrieval

```typescript
// Example usage
const narrativeImageMatcher = new NarrativeImageMatcher(characterEngine);
const sceneImage = await narrativeImageMatcher.generateSceneImage(
  scene,
  charactersMap
);
```

### EmotionMapper

The `EmotionMapper` analyzes text sentiment to determine emotional content and map it to character expressions. It provides:

- Text emotion analysis
- Character emotion mapping based on scene context
- Contextual factor identification
- Emotion adjustment based on character traits

**Key Features:**
- Analyzes text to determine primary and secondary emotions
- Maps scene emotions to character-specific reactions
- Adjusts emotions based on character traits and personality
- Identifies contextual factors that influence emotions

**Technical Implementation:**
- Uses a combination of keyword matching and contextual analysis
- Maps complex emotions to basic emotion categories
- Adjusts emotional intensity based on character traits
- Identifies contextual factors like social situations, threats, or achievements

```typescript
// Example usage
const emotionMapper = new EmotionMapper();
const emotion = emotionMapper.analyzeTextEmotion(text);
const characterEmotion = emotionMapper.mapCharacterEmotion(character, scene);
```

### BranchLogicManager (Planned)

The `BranchLogicManager` handles complex conditional branches and variable tracking for interactive storytelling. It provides:

- Condition evaluation against story variables
- Next scene determination based on choices and story state
- Variable updates based on choice consequences
- Story logic analysis for potential issues

**Key Features:**
- Evaluates complex conditions for branching narratives
- Tracks and updates story variables based on user choices
- Analyzes story logic for dead ends or unreachable branches
- Provides visualization tools for story structure

**Technical Implementation:**
- Uses a graph-based representation of story structure
- Implements a variable tracking system for story state
- Provides condition evaluation for complex branching logic
- Includes tools for analyzing and visualizing story structure

```typescript
// Example usage (planned)
const branchLogicManager = new BranchLogicManager();
const nextSceneId = branchLogicManager.determineNextScene(choice, progress);
const updatedVariables = branchLogicManager.updateVariables(choice, currentVariables);
```

## 🔌 Integration with React

These components are integrated with React through custom hooks:

### useAI Hook

The `useAI` hook provides a simple interface for React components to access the AI functionality:

```typescript
const { 
  loading, 
  error, 
  generateCharacterImage, 
  generateSceneImage,
  analyzeTextEmotion,
  mapCharacterEmotion,
  optimizeSceneDescription
} = useAI();
```

**Key Features:**
- Provides loading and error states for better UX
- Handles caching and optimization automatically
- Exposes all AI functionality through a simple interface
- Manages asynchronous operations with proper error handling

### useStoryBranching Hook (Planned)

The `useStoryBranching` hook will provide tools for managing interactive story branching:

```typescript
const {
  currentScene,
  availableChoices,
  makeChoice,
  variables,
  history
} = useStoryBranching(story, startingSceneId);
```

## 🌐 API Endpoints

The AI components are backed by API endpoints:

### `/api/ai/generate-character`

Generates character images based on character data, emotion, outfit, and scene context.

**Request:**
```json
{
  "character": { /* Character object */ },
  "emotion": "happy",
  "outfit": "casual",
  "scene": "forest",
  "prompt": "A happy female character with silver hair in a forest setting"
}
```

**Response:**
```json
{
  "imageUrl": "/images/characters/char1_happy.jpg",
  "prompt": "A happy female character with silver hair in a forest setting",
  "generatedAt": "2023-09-15T12:34:56Z"
}
```

### `/api/ai/generate-scene`

Generates scene images based on scene data and characters present in the scene.

**Request:**
```json
{
  "scene": { /* Scene object */ },
  "characters": [ /* Character objects */ ],
  "prompt": "Ancient library with dust motes dancing in light shafts"
}
```

**Response:**
```json
{
  "imageUrl": "/images/scenes/scene1.jpg",
  "prompt": "Ancient library with dust motes dancing in light shafts",
  "generatedAt": "2023-09-15T12:34:56Z"
}
```

### `/api/ai/analyze-emotion`

Analyzes text to determine emotional content.

**Request:**
```json
{
  "text": "She felt a surge of joy as she discovered the ancient tome."
}
```

**Response:**
```json
{
  "primaryEmotion": "joy",
  "intensity": 0.8,
  "secondaryEmotions": ["surprise", "anticipation"],
  "confidence": 0.9,
  "contextualFactors": ["achievement", "discovery"]
}
```

## 🔮 Future Enhancements

We have several exciting enhancements planned for the AI components:

### Short-term Roadmap (Next 3 Months)

- **Voice Generation**: Add character voice generation based on traits and emotions
- **Animation**: Simple character animations for key emotional states
- **Advanced NLP**: Improve text analysis for better emotion detection
- **Style Consistency**: Ensure consistent art style across all generated images

### Medium-term Roadmap (3-6 Months)

- **Dynamic Story Adaptation**: Adjust story based on reader preferences and reactions
- **Character Relationship Modeling**: Model complex relationships between characters
- **Multi-modal Output**: Combine text, image, and audio for immersive experiences
- **Collaborative AI**: Tools for AI-assisted collaborative storytelling

### Long-term Vision (6+ Months)

- **Fully Animated Scenes**: Generate animated scenes with character interactions
- **Personalized Stories**: Adapt stories to individual reader preferences
- **Cross-story Character Consistency**: Maintain character consistency across different stories
- **Interactive Dialogue**: Generate dynamic dialogue options based on character traits and story context

## 🧪 Testing

The AI components include comprehensive tests to ensure reliability:

```bash
# Run unit tests for AI components
npm run test:ai

# Run integration tests with API endpoints
npm run test:ai-integration

# Run performance tests
npm run test:ai-performance
```

## 📚 Documentation

For more detailed documentation on each component, see:

- [CharacterConsistencyEngine Documentation](./docs/CharacterConsistencyEngine.md)
- [NarrativeImageMatcher Documentation](./docs/NarrativeImageMatcher.md)
- [EmotionMapper Documentation](./docs/EmotionMapper.md)
- [API Endpoints Documentation](./docs/API.md)

## 🤝 Contributing

We welcome contributions to the AI components! Please see our [Contributing Guide](../../CONTRIBUTING.md) for more information on how to get involved. 