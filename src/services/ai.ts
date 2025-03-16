/**
 * AI service for generating story content and character images
 */

/**
 * Generate a story continuation based on the current context and user choices
 * @param storyContext The current story context
 * @param userChoice The user's choice
 * @returns The generated story continuation
 */
export const generateStoryContinuation = async (
  storyContext: string,
  userChoice: string
): Promise<string> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not defined');
    }
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an interactive storyteller for Lumen Tales, a platform for interactive narratives.
                
                Current story context:
                ${storyContext}
                
                User choice:
                ${userChoice}
                
                Continue the story based on this choice. Write 2-3 paragraphs (150-300 words) that advance the narrative in an engaging way. End with 2-3 new choices for the reader.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error generating story: ${data.error?.message || 'Unknown error'}`);
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating story continuation:', error);
    throw error;
  }
};

/**
 * Generate a character image based on the description
 * @param characterDescription The character description
 * @returns The URL of the generated image
 */
export const generateCharacterImage = async (
  characterDescription: string,
  emotionalState: string = 'neutral',
  style: string = 'realistic'
): Promise<string> => {
  try {
    // This is a placeholder for actual image generation API integration
    // In a real implementation, this would call an image generation API like DALL-E, Midjourney, or Stable Diffusion
    
    // For now, return a placeholder image
    return `https://via.placeholder.com/512x512?text=${encodeURIComponent('Character Image')}`;
    
    // Example implementation with an actual API would look like:
    /*
    const apiKey = process.env.IMAGE_GENERATION_API_KEY;
    
    if (!apiKey) {
      throw new Error('Image generation API key not defined');
    }
    
    const response = await fetch('https://api.example.com/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `${characterDescription}, ${emotionalState} expression, ${style} style`,
        width: 512,
        height: 512,
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error generating image: ${data.error?.message || 'Unknown error'}`);
    }
    
    return data.url;
    */
  } catch (error) {
    console.error('Error generating character image:', error);
    throw error;
  }
};

/**
 * Generate a scene image based on the description
 * @param sceneDescription The scene description
 * @returns The URL of the generated image
 */
export const generateSceneImage = async (
  sceneDescription: string,
  style: string = 'realistic'
): Promise<string> => {
  try {
    // This is a placeholder for actual image generation API integration
    // In a real implementation, this would call an image generation API
    
    // For now, return a placeholder image
    return `https://via.placeholder.com/1024x512?text=${encodeURIComponent('Scene Image')}`;
  } catch (error) {
    console.error('Error generating scene image:', error);
    throw error;
  }
};

/**
 * Analyze user choices to determine character development
 * @param storyContext The current story context
 * @param allUserChoices Array of all user choices made so far
 * @returns Analysis of character development based on choices
 */
export const analyzeCharacterDevelopment = async (
  storyContext: string,
  allUserChoices: string[]
): Promise<{
  personality: {
    courage: number;
    wisdom: number;
    compassion: number;
    ambition: number;
  };
  archetype: string;
  developmentSummary: string;
}> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not defined');
    }
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI assistant for Lumen Tales, a platform for interactive narratives.
                
                Current story context:
                ${storyContext}
                
                User choices made so far:
                ${allUserChoices.join('\n')}
                
                Analyze the character development based on these choices. Return a JSON object with the following structure:
                {
                  "personality": {
                    "courage": [number between 0-100],
                    "wisdom": [number between 0-100],
                    "compassion": [number between 0-100],
                    "ambition": [number between 0-100]
                  },
                  "archetype": [character archetype based on choices],
                  "developmentSummary": [brief summary of character development]
                }`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error analyzing character development: ${data.error?.message || 'Unknown error'}`);
    }
    
    const resultText = data.candidates[0].content.parts[0].text;
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse character development analysis');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error analyzing character development:', error);
    // Return default values if analysis fails
    return {
      personality: {
        courage: 50,
        wisdom: 50,
        compassion: 50,
        ambition: 50,
      },
      archetype: 'Undefined',
      developmentSummary: 'Character development analysis failed.',
    };
  }
}; 