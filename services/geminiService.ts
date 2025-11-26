import { GoogleGenAI, Type } from "@google/genai";
import { DEFAULT_GEMINI_MODEL } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY || '';

export const isAIConfigured = (): boolean => {
  return !!API_KEY;
};

export const generateSmartSlug = async (originalUrl: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    Analyze this URL: "${originalUrl}".
    Create a short, memorable, URL-safe slug (max 10 characters) that represents the content of the URL.
    Examples:
    - https://www.google.com -> "google" or "search"
    - https://react.dev -> "react-dev"
    - https://www.youtube.com/watch?v=dQw4w9WgXcQ -> "rickroll"
    
    Return ONLY the slug string. No JSON, no formatting, no explanations.
    Ensure it contains only alphanumeric characters and hyphens.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are a creative URL shortener assistant.",
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                slug: {
                    type: Type.STRING,
                    description: "The generated short slug for the URL"
                }
            }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    const parsed = JSON.parse(jsonText);
    return parsed.slug?.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'link-' + Date.now().toString(36).slice(-4);
    
  } catch (error) {
    console.error("Gemini Slug Generation Error:", error);
    // Fallback if AI fails
    return 'u-' + Math.random().toString(36).substring(2, 7);
  }
};