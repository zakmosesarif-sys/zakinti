import { GoogleGenAI } from "@google/genai";
import { PetStage } from "../types";

// Using the requested lite model mapping
const MODEL_NAME = 'gemini-flash-lite-latest';

// Helper to safely get the API key
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing from environment variables.");
    return "";
  }
  return key;
};

export const generatePetReaction = async (
  habitName: string, 
  petName: string, 
  stage: PetStage,
  streak: number
): Promise<string> => {
  const key = getApiKey();
  if (!key) return "Yay! Good job!";

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    
    const prompt = `
      You are a virtual pet named ${petName}. You are currently at the ${stage} stage of evolution.
      The user just completed the habit: "${habitName}".
      The user has a streak of ${streak} days.
      
      Give a very short, enthusiastic, and cute reaction (max 15 words).
      If you are an Egg, say something like "Wiggle wiggle!".
      If you are a Baby, speak in simple cute words.
      If you are an Adult, be proud and encouraging.
      Use an emoji relevant to the habit if possible.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Good job!";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Great job! Keep it up!";
  }
};

export const generatePetGreeting = async (
  petName: string,
  stage: PetStage,
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): Promise<string> => {
  const key = getApiKey();
  if (!key) return "Hello friend!";

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `
      You are a virtual pet named ${petName} at ${stage} stage.
      It is ${timeOfDay}. 
      Greet the user briefly and ask them to do their habits (max 12 words).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    return response.text || "Let's do some habits!";
  } catch (error) {
    return "Ready to grow?";
  }
};