
import { GoogleGenAI } from "@google/genai";
import { Rendition } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateImagesFromApi = async (prompt: string, numberOfImages: number, tags: string[] = []): Promise<string[]> => {
    const tagString = tags.length > 0 ? tags.join(', ') + ', ' : '';
    const fullPrompt = `A high-quality, vibrant, digital art style character portrait: ${tagString}${prompt}`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: {
          numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    }
    return [];
}

export const generateImageRenditions = async (prompt: string, numberOfImages: number, tags: string[] = []): Promise<Rendition[]> => {
  try {
    const imageUrls = await generateImagesFromApi(prompt, numberOfImages, tags);
    return imageUrls.map(url => ({
        prompt,
        imageUrl: url
    }));
  } catch (error) {
    console.error("Error generating image renditions:", error);
    throw new Error("Failed to generate image renditions. Please check the console for details.");
  }
};


export const generateImage = async (prompt: string, tags: string[] = []): Promise<string> => {
  try {
    const results = await generateImagesFromApi(prompt, 1, tags);
    if (results.length > 0) {
        return results[0];
    } else {
        throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};

export const generateStoryForImage = async (imagePrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short, engaging story opening (2-3 sentences) for a fantasy book based on this character or scene: "${imagePrompt}"`,
        config: {
          temperature: 0.8,
          topP: 0.95,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story text.");
  }
};