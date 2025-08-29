
import { GoogleGenAI, Type } from "@google/genai";
import type { Goals } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: {
      type: Type.STRING,
      description: "A descriptive name of the food item or meal. e.g., 'Chicken Salad Sandwich' or 'Scrambled Eggs with Toast'."
    },
    calories: {
      type: Type.NUMBER,
      description: "The estimated total calorie count for the meal."
    },
    protein: {
      type: Type.NUMBER,
      description: "The estimated grams of protein in the meal."
    },
    carbs: {
      type: Type.NUMBER,
      description: "The estimated grams of carbohydrates in the meal."
    },
    fat: {
      type: Type.NUMBER,
      description: "The estimated grams of fat in the meal."
    },
  },
  required: ["foodName", "calories", "protein", "carbs", "fat"],
};

export const analyzeMealImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze the food in this image. Identify the meal and estimate its nutritional information (calories, protein, carbs, fat).",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: mealSchema,
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("AI returned an empty response. The image might be unclear.");
    }

    const parsed = JSON.parse(jsonText);
    
    // Validate response
    if (typeof parsed.foodName !== 'string' || typeof parsed.calories !== 'number' || typeof parsed.protein !== 'number' || typeof parsed.carbs !== 'number' || typeof parsed.fat !== 'number') {
        throw new Error("AI response is missing required nutritional fields.");
    }
    
    return parsed;

  } catch (error) {
    console.error("Error analyzing meal image:", error);
    throw new Error("Could not analyze the meal. Please try a different image or check your API key.");
  }
};

export const getCoachingTip = async (logContext: string, goals: Goals) => {
    try {
        const prompt = `
            You are Kal AI, a friendly and motivating health coach.
            A user has the following daily goals: ${goals.calories} calories, ${goals.protein}g protein, ${goals.carbs}g carbs, ${goals.fat}g fat, ${goals.water}ml water, and ${goals.sleep} hours of sleep.
            Their latest activity is: "${logContext}".
            Based on this, provide a single, short, encouraging, and actionable health tip (1-2 sentences). Do not use markdown. Be positive and helpful.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                // Disable thinking for low latency response
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error getting coaching tip:", error);
        throw new Error("Could not get a coaching tip at this time.");
    }
};
