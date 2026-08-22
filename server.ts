import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parsing with large limit for high-res base64 photo booth captures
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lazy GoogleGenAI client
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Clean base64 string helper
function cleanBase64(dataUrlOrBase64: string): { data: string; mimeType: string } {
  if (dataUrlOrBase64.startsWith('data:')) {
    const match = dataUrlOrBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
  }
  return { mimeType: 'image/jpeg', data: dataUrlOrBase64 };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Endpoint 1: Analyze user portrait using gemini-3.1-pro-preview
app.post('/api/analyze-portrait', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided for facial analysis.' });
    }

    const ai = getGenAI();
    const { data: base64Data, mimeType } = cleanBase64(image);

    const promptText = `
You are the AI Chief Temporal Archivist of the Time-Travel Photo Booth.
Analyze this portrait photograph in detail to prepare the passenger for historical teleportation.
Examine:
1. Facial expression and mood (e.g. confident, contemplative, smiling, regal, adventurous).
2. Facial geometry, head pose, lighting direction, eye level, and natural aesthetic traits.
3. Suggest 3 specific historical roles or archetypes that match their energy (e.g. "High Renaissance Master Painter", "Apollo Mission Flight Commander", "Edo Period Shogun Strategist").
4. Evaluate compatibility with historical eras and rank top recommended eras with compatibility scores (0-100%) and captivating reasons.
5. Provide styling advice for period costume integration.
6. Provide an inspiring, witty temporal traveler quote.

Respond with strict JSON matching the schema.
`;

    // Attempt with gemini-3.1-pro-preview as requested, fallback to gemini-3.7-flash
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedExpression: {
                type: Type.STRING,
                description: 'Brief description of detected expression and demeanor.',
              },
              facialStructure: {
                type: Type.STRING,
                description: 'Observation of facial structure, head angle, and lighting.',
              },
              lightingAngle: {
                type: Type.STRING,
                description: 'Key lighting direction on the face.',
              },
              suggestedHistoricalRoles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 suitable historical roles.',
              },
              recommendedEras: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    eraId: { type: Type.STRING },
                    eraTitle: { type: Type.STRING },
                    compatibilityScore: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                  },
                  required: ['eraId', 'eraTitle', 'compatibilityScore', 'reason'],
                },
              },
              customStylingAdvice: {
                type: Type.STRING,
                description: 'Advice for costume and prop blending.',
              },
              historicalQuote: {
                type: Type.STRING,
                description: 'A witty historical traveler quote.',
              },
            },
            required: [
              'detectedExpression',
              'facialStructure',
              'suggestedHistoricalRoles',
              'recommendedEras',
              'customStylingAdvice',
              'historicalQuote',
            ],
          },
        },
      });
    } catch (primaryError) {
      console.warn('Falling back to gemini-3.7-flash for portrait analysis:', primaryError);
      response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            {
              text: `${promptText}\nOutput MUST be valid JSON only.`,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const textOutput = response.text || '{}';
    const parsed = JSON.parse(textOutput);
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing portrait:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze portrait with Gemini.',
    });
  }
});

// Endpoint 2: Time-travel image generation using gemini-3.1-flash-image-preview
app.post('/api/time-travel', async (req, res) => {
  try {
    const { image, eraTitle, eraYear, sceneName, scenePromptModifier, clothingDescription, backgroundSetting, artStyle, customPrompt, passengerName } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Source portrait image is required.' });
    }

    const ai = getGenAI();
    const { data: base64Data, mimeType } = cleanBase64(image);

    const fullPrompt = `
Transform the person in the provided input photo into a breathtaking, authentic historical portrait in ${eraTitle} (${eraYear}).

CRITICAL INSTRUCTIONS FOR FACIAL INSERTION & IDENTITY PRESERVATION:
1. Retain the exact recognizable facial identity, facial bone structure, eyes, nose, lips, smile/expression, skin tone, and authentic likeness of the person from the input image.
2. Transport this person into the historical era: dress them in authentic period costume (${clothingDescription}).
3. Setting & Scene: Place them in ${sceneName}. ${scenePromptModifier || ''} ${backgroundSetting || ''}.
4. Artistic & Lighting Style: ${artStyle || 'Cinematic period-accurate lighting with fine historical textures'}.
${customPrompt ? `5. Additional custom instruction requested by passenger: "${customPrompt}". Seamlessly incorporate this detail.` : ''}
Ensure the face blends seamlessly with the body, neck, hairstyle, and period lighting without looking like a simple cut-and-paste. Make it look like a real, authentic masterpiece photograph or portrait from ${eraYear}.
`;

    // Call gemini-3.1-flash-image-preview (with fallback to gemini-3.1-flash-image or gemini-3.1-flash-lite-image)
    let imageBase64: string | null = null;
    let modelUsed = 'gemini-3.1-flash-image-preview';

    const modelsToTry = [
      'gemini-3.1-flash-image-preview',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType || 'image/jpeg',
                },
              },
              {
                text: fullPrompt,
              },
            ],
          },
        });

        const candidates = response.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              imageBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              modelUsed = modelName;
              break;
            }
          }
        }

        if (imageBase64) {
          break;
        }
      } catch (err: any) {
        console.warn(`Attempt with ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!imageBase64) {
      throw lastError || new Error('No image was returned by the temporal rendering engine.');
    }

    // Generate a fun 2-sentence historical lore blurb for the Time Passport
    let historicalLore = `Traveler registered in ${eraTitle} (${eraYear}). Recorded amidst ${sceneName}.`;
    try {
      const loreResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Write an exciting, witty 2-sentence historical record for time traveler ${passengerName || 'the passenger'} who just arrived in ${eraTitle} (${eraYear}) at ${sceneName}. Detail what the locals or court records noted about their arrival.`,
      });
      if (loreResponse.text) {
        historicalLore = loreResponse.text.trim();
      }
    } catch (e) {
      console.warn('Could not generate lore blurb, using default.');
    }

    return res.json({
      success: true,
      generatedImage: imageBase64,
      modelUsed,
      historicalLore,
    });
  } catch (error: any) {
    console.error('Error generating time-travel photo:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate time-travel photo.',
    });
  }
});

// Endpoint 3: Text-prompt based AI image editing using gemini-3.1-flash-image-preview
app.post('/api/edit-scene', async (req, res) => {
  try {
    const { image, editPrompt } = req.body;

    if (!image || !editPrompt) {
      return res.status(400).json({ error: 'Image and edit prompt are required.' });
    }

    const ai = getGenAI();
    const { data: base64Data, mimeType } = cleanBase64(image);

    const fullPrompt = `
Edit the provided historical image based on the following instruction: "${editPrompt}".
Maintain the character's facial likeness, historical era context, lighting harmony, and high photographic/portrait quality. Apply the requested modification naturally.
`;

    let imageBase64: string | null = null;
    const modelsToTry = [
      'gemini-3.1-flash-image-preview',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType || 'image/png',
                },
              },
              {
                text: fullPrompt,
              },
            ],
          },
        });

        const candidates = response.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              imageBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (imageBase64) break;
      } catch (err) {
        console.warn(`Edit with ${modelName} failed:`, err);
        lastError = err;
      }
    }

    if (!imageBase64) {
      throw lastError || new Error('Failed to edit historical scene.');
    }

    return res.json({
      success: true,
      generatedImage: imageBase64,
    });
  } catch (error: any) {
    console.error('Error editing scene:', error);
    return res.status(500).json({
      error: error.message || 'Failed to edit historical scene.',
    });
  }
});

// Endpoint 4: Custom Era Concept Generator
app.post('/api/custom-era', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'User prompt is required.' });
    }

    const ai = getGenAI();
    const prompt = `
Create a detailed historical era entry based on the user's idea: "${userPrompt}".
Return a JSON object conforming to the schema with authentic clothing, historical context, background, art style, and 3 immersive scenes.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            year: { type: Type.STRING },
            eraCategory: {
              type: Type.STRING,
              enum: ['ancient', 'medieval', 'renaissance', 'victorian', '20th_century', 'futuristic'],
            },
            shortDescription: { type: Type.STRING },
            detailedContext: { type: Type.STRING },
            icon: { type: Type.STRING },
            accentColor: { type: Type.STRING },
            clothingDescription: { type: Type.STRING },
            backgroundSetting: { type: Type.STRING },
            artStyle: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  promptModifier: { type: Type.STRING },
                },
                required: ['id', 'name', 'description', 'promptModifier'],
              },
            },
            samplePrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'id',
            'title',
            'year',
            'eraCategory',
            'shortDescription',
            'detailedContext',
            'clothingDescription',
            'backgroundSetting',
            'artStyle',
            'scenes',
            'samplePrompts',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, customEra: parsed });
  } catch (error: any) {
    console.error('Error generating custom era:', error);
    return res.status(500).json({ error: error.message || 'Failed to create custom era.' });
  }
});

// Vite middleware for dev / static for prod
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Time-Travel Photo Booth Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
