import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable for the API key. 
// Note for Hackathon: Normally, putting API key in frontend is unsafe.
// This is for demonstration purposes. Use your own key in .env.local (`VITE_GEMINI_API_KEY`)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

export const generateFarmingAdvice = async (
  query: string,
  userCrops: string[],
  activeCrop: string,
  temperature: number,
  condition: string,
  imageBase64?: string
): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptText = `
User Query: ${query}

Context:
* User's Total Farm Crops: ${userCrops.length > 0 ? userCrops.join(', ') : 'None'}
* Currently Focused Crop: ${activeCrop || 'None (General Farming Query)'}
* Weather: ${temperature}°C, ${condition}
* Location: Kerala

Rules:
* Always respond in Malayalam.
* You are an AI assistant that provides personalised farming guidance.
* If the user asks "What are my crops?", list out their 'Total Farm Crops'.
* If a 'Currently Focused Crop' is specified, tailor your advice STRICTLY to that specific crop.
* If the 'Currently Focused Crop' is 'None', but their question implies general weather or farm management, give tips that apply broadly to their 'Total Farm Crops'.
* Use simple and practical language.
* Give step-by-step advice.
* Avoid technical jargon.

Special Behavior:
* If user asks something unrelated to farming:
  - Try to relate it to agriculture if possible
  - Otherwise reply EXACTLY: 'ക്ഷമിക്കണം, ഞാൻ കൃഷിയുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾക്ക് മാത്രം സഹായിക്കാം.'
* If image is provided:
  - Identify plant disease or issue
  - Provide solution steps
`;

    if (imageBase64) {
      // Split off the data URL prefix if present
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const mimeType = imageBase64.includes(';') ? imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';')) : "image/jpeg";
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        },
      };

      const result = await model.generateContent([promptText, imagePart]);
      return result.response.text();
    } else {
      const result = await model.generateContent(promptText);
      return result.response.text();
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ക്ഷമിക്കണം, നിർദ്ദേശം കണ്ടെത്താൻ കഴിഞ്ഞില്ല. (Sorry, couldn't fetch advice. Please try again.)";
  }
};
